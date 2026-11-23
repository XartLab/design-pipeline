"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const evaluator = path.join(repoRoot, "skill", "scripts", "evaluate-anti-slop.cjs");
const rubric = path.join(repoRoot, "skill", "references", "anti-slop-rubric.json");
const lintMap = path.join(repoRoot, "skill", "references", "anti-slop-lint-map.json");
const fixtures = path.join(__dirname, "fixtures", "anti-slop-lint");
const roots = new Set();

function makeRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "design-pipeline-anti-slop-lint-"));
  roots.add(root);
  return root;
}

test.after(() => {
  for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
});

function run(root, evidence, ...args) {
  return spawnSync(
    process.execPath,
    [evaluator, "--root", root, "--rubric", rubric, "--evidence", evidence, "--json", ...args],
    { cwd: root, encoding: "utf8", env: { ...process.env, DESIGN_PIPELINE_NOW: "2026-07-19T10:15:00.000Z" } },
  );
}

function parse(result) {
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

// A complete evidence file: hard rules pass, contextual rules accepted with a per-rule reason.
// `overrides` replaces single observations, e.g. to mark a hard rule fail so a lint finding is not a
// contradiction, or to record accepted context for one contextual rule.
function fullEvidence(root, overrides = {}) {
  const rubricData = JSON.parse(fs.readFileSync(rubric, "utf8"));
  const observations = rubricData.rules.map((rule) => {
    if (overrides[rule.id]) return { ruleId: rule.id, ...overrides[rule.id] };
    if (rule.severity === "hard") {
      return { ruleId: rule.id, outcome: "pass", evidence: [`Reviewed ${rule.id} against the built target.`] };
    }
    return {
      ruleId: rule.id,
      outcome: "accepted-context",
      evidence: [`Reviewed ${rule.id} against the built target.`],
      rationale: `For ${rule.id}: this target's brief calls for the deliberate choice, so it is not an unexamined default.`,
    };
  });
  const file = path.join(root, "evidence.json");
  fs.writeFileSync(file, `${JSON.stringify({ schema: "design-pipeline.anti-slop-evidence.v1", target: { id: "lint-target", surface: "marketing" }, observations })}\n`);
  return file;
}

test("a hard rule marked pass is rejected when the page prints a fake success (gate 70)", () => {
  const root = makeRoot();
  const evidence = fullEvidence(root);
  const result = run(root, evidence, "--lint", path.join(fixtures, "fake-success.html"));
  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, /LINT_CONTRADICTS_PASS/);
  assert.match(result.stderr, /gate 70/);
  assert.match(result.stderr, /fake-success\.html:29/);
});

test("a contextual placeholder name is accepted with a documented reason (gate 19)", () => {
  const root = makeRoot();
  const evidence = fullEvidence(root, {
    "content-specificity": {
      outcome: "accepted-context",
      evidence: ["The testimonial name is a placeholder for the design review."],
      rationale: "The brief supplies the quote and the owner replaces the placeholder name before launch.",
    },
  });
  const report = parse(run(root, evidence, "--lint", path.join(fixtures, "placeholder-name.html"))).report;
  const finding = report.lint.findings.find((item) => item.gate === "19");
  assert.ok(finding, "the gate 19 finding is listed");
  assert.equal(finding.class, "contextual");
  assert.equal(finding.status, "accepted-context");
});

test("an excluded Hallmark house rule produces no finding (gate 20)", () => {
  const root = makeRoot();
  const evidence = fullEvidence(root);
  const report = parse(run(root, evidence, "--lint", path.join(fixtures, "placeholder-name.html"))).report;
  assert.ok(!report.lint.findings.some((item) => item.gate === "20"), "the excluded stamp gate is not reported");
});

test("a gate missing from the map fails the run with LINT_GATE_UNMAPPED", () => {
  const root = makeRoot();
  const evidence = fullEvidence(root);
  const map = JSON.parse(fs.readFileSync(lintMap, "utf8"));
  delete map.gates["70"];
  const mapFile = path.join(root, "lint-map.json");
  fs.writeFileSync(mapFile, `${JSON.stringify(map)}\n`);
  const result = run(root, evidence, "--lint", path.join(fixtures, "fake-success.html"), "--lint-map", mapFile);
  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, /LINT_GATE_UNMAPPED/);
  assert.match(result.stderr, /70/);
});

test("a linted file that changes after the lint block was written is rejected as stale", () => {
  const root = makeRoot();
  const page = path.join(root, "page.html");
  fs.copyFileSync(path.join(fixtures, "fake-success.html"), page);
  const lintEvidence = fullEvidence(root, {
    "controls-are-real-and-operable": { outcome: "fail", evidence: ["Gate 70: a script prints success with no request behind it."] },
  });
  const lintBlock = parse(run(root, lintEvidence, "--lint", page)).report.lint;
  assert.ok(lintBlock.findings.some((item) => item.gate === "70"), "the fresh lint run recorded gate 70");

  const rubricData = JSON.parse(fs.readFileSync(rubric, "utf8"));
  const observations = rubricData.rules.map((rule) => (rule.severity === "hard"
    ? { ruleId: rule.id, outcome: "pass", evidence: [`Reviewed ${rule.id} against the built target.`] }
    : { ruleId: rule.id, outcome: "accepted-context", evidence: [`Reviewed ${rule.id} against the built target.`], rationale: `For ${rule.id}: this target's brief calls for the deliberate choice, so it is not an unexamined default.` }));
  const stored = { tool: lintBlock.tool, commit: lintBlock.commit, target: lintBlock.target, digest: lintBlock.digest, findings: lintBlock.findings.map(({ status, ...finding }) => finding) };
  const evidencePath = path.join(root, "evidence-with-lint.json");
  fs.writeFileSync(evidencePath, `${JSON.stringify({ schema: "design-pipeline.anti-slop-evidence.v1", target: { id: "lint-target", surface: "marketing" }, observations, lint: stored })}\n`);

  fs.appendFileSync(page, "\n<!-- changed after the lint block -->\n");
  const result = run(root, evidencePath);
  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, /LINT_STALE/);
});

test("the vendored linter is invoked unmodified and the lint map covers every gate it reports", () => {
  const map = JSON.parse(fs.readFileSync(lintMap, "utf8"));
  assert.equal(map.schema, "design-pipeline.anti-slop-lint-map.v1");
  const classes = new Set(Object.values(map.gates).map((entry) => entry.class));
  assert.deepEqual([...classes].sort(), ["contextual", "excluded", "hard", "preference"]);
});