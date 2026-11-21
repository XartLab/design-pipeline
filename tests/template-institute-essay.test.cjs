"use strict";

// The institute-essay style pack: the grammar of AI research institute long-form explainers and research
// essays, measured on two public reference pages (kept private, never shipped). Six templates (hero with a
// seeded pixel burst, finding with crayon bars, figure with a sticky note, pull quote, scenario cards, a flow
// band of hand-drawn icons), each rendered from parameters with original copy, and the HTML long-read kit
// that proves the grammar. The browser checks share their Chromes (tests/helpers/kit-browser-check.cjs): the
// two kit widths run at once from the first test on, and the default renders share one Chrome.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const bank = require("../skill/tools/template-bank/bank.cjs");
const { locateBrowser, CI_SKIP, checkKit, checkRenders } = require("./helpers/kit-browser-check.cjs");

const REPO = path.join(__dirname, "..");
const CLI = path.join(REPO, "skill", "scripts", "designer-pipeline.cjs");
const KIT = path.join(REPO, "examples", "institute-essay-report-kit");
const CATALOG = JSON.parse(fs.readFileSync(path.join(REPO, "skill", "references", "fonts", "catalog.json"), "utf8"));
const IDS = ["card.essay-finding", "card.essay-flow", "card.essay-note-figure", "card.essay-pullquote", "cover.essay-hero", "doc.essay-scenarios"];

const messages = (report) => JSON.stringify(report.findings.map((f) => `${f.rule}:${f.slot}: ${f.message}`));
function cli(root, ...args) {
  const child = spawnSync(process.execPath, [CLI, ...args, "--root", root, "--json"], { encoding: "utf8", windowsHide: true, timeout: 600000, maxBuffer: 64 << 20 });
  let payload = null;
  try { payload = JSON.parse(child.stdout); } catch { payload = null; }
  return { status: child.status, payload, stderr: child.stderr };
}
const BROWSER = locateBrowser();
const SKIP = BROWSER.skip || CI_SKIP;
// The kit check is the slow part (a long page, a screenshot per text unit): start both widths as soon as the
// first test runs, so they overlap the static tests, and let the kit test await the result.
let kitRun = null;
const kitChecks = () => (kitRun ||= checkKit(BROWSER, path.join(KIT, "index.html"), [1440, 390]));

test("institute-essay names its case and lineage, borrows grammar not assets, names no organisation and resolves its fonts through the catalog", () => {
  if (!SKIP) kitChecks().catch(() => {});
  const style = bank.loadStyle("institute-essay");
  assert.match(style.provenance.borrow, /^Borrow grammar, never assets\./);
  assert.match(style.provenance.lineage, /stay private and are not shipped/);
  assert.ok(style.layout.grammar.length >= 6 && style.motion.grammar.length);
  assert.ok(style.checks.guidance.some((line) => /^64 px distinctiveness \(guidance/.test(line)));
  assert.ok(style.checks.guidance.some((line) => /faint grey #87867F is for large type only/.test(line)));
  assert.equal(style.checks.browserOnRender, true);
  for (const recipe of style.materials.recipes) assert.match(recipe, /materials (fetch|cut|process|generate)/);
  const families = new Set(CATALOG.families.map((f) => f.family));
  for (const [role, spec] of Object.entries(style.fonts.roles)) {
    assert.ok(spec.stack.length >= 2 && spec.stack.some((family) => families.has(family)), `${role}: ${spec.stack.join(" > ")}`);
  }
  assert.equal(style.palette.ivory.value, "#FAF9F5");
  assert.equal(style.palette.clay.value, "#D97757");
  const all = JSON.stringify(style) + IDS.map((id) => JSON.stringify(bank.loadManifest(id)) + fs.readFileSync(path.join(bank.TEMPLATES_ROOT, id, "spec.md"), "utf8") + fs.readFileSync(path.join(bank.TEMPLATES_ROOT, id, "template.svg"), "utf8")).join("");
  assert.doesNotMatch(all, /anthropic|claude|openai|deepmind|google ai|\bmeta ai\b|\bgpt\b|gemini|\bllama\b/i);
  assert.deepEqual(bank.templateIds().filter((id) => bank.loadManifest(id).style === "institute-essay"), IDS);
  const listed = cli(fs.mkdtempSync(path.join(os.tmpdir(), "institute-essay-")), "template", "list", "--style", "institute-essay");
  assert.equal(listed.status, 0, JSON.stringify(listed.payload));
  assert.deepEqual(listed.payload.styles[0].templates, IDS);
});

test("institute-essay templates pass the static check at every size and for 50 seeds, and in their variants", () => {
  for (const id of IDS) {
    for (const size of bank.loadManifest(id).sizes) {
      for (const theme of ["light", "dark"]) {
        const report = bank.check(bank.render(id, { size, params: { theme } }).svg);
        assert.equal(report.status, "passed", `${id} ${size} ${theme}: ${messages(report)}`);
      }
    }
    for (let seed = 1; seed <= 50; seed += 1) {
      const report = bank.check(bank.render(id, { seed }).svg);
      assert.equal(report.status, "passed", `${id} seed ${seed}: ${messages(report)}`);
    }
  }
  const variants = [
    ["cover.essay-hero", { density: 0.8, seed: 9999 }, {}],
    ["cover.essay-hero", { density: 0.3, seed: 1 }, { title_1: "How far will", title_2: "compute go?", cta_1: "Read", cta_2: "Scenarios" }],
    ["card.essay-finding", { value_1: 0, value_2: 300, value_3: 150, max: 300 }, {}],
    ["card.essay-note-figure", { spread: 0.8, lines: 24 }, {}],
    ["card.essay-pullquote", {}, { quote: "The question is not whether spending keeps growing but whether cost per token falls faster than demand rises." }],
    ["doc.essay-scenarios", { level_1: 3, level_2: 1, level_3: 2 }, {}],
    ["card.essay-flow", { count: 3, icon_start: 2 }, { label_1: "Sources", label_2: "Model", label_3: "Report" }],
    ["card.essay-flow", { count: 4, icon_start: 4 }, {}],
  ];
  for (const [id, params, set] of variants) {
    const report = bank.check(bank.render(id, { params, set }).svg);
    assert.equal(report.status, "passed", `${id} ${JSON.stringify(params)}: ${messages(report)}`);
  }
});

test("the burst is seeded: same seed, same render; another seed, another burst", () => {
  const a = bank.render("cover.essay-hero", { params: { seed: 7 } }).svg;
  assert.equal(a, bank.render("cover.essay-hero", { params: { seed: 7 } }).svg);
  assert.notEqual(a, bank.render("cover.essay-hero", { params: { seed: 8 } }).svg);
  const count = (svg) => (svg.match(/data-role="clay"/g) || []).length;
  assert.ok(count(bank.render("cover.essay-hero", { params: { density: 0.8 } }).svg) > count(bank.render("cover.essay-hero", { params: { density: 0.3 } }).svg));
});

test("a bar and its value come from one parameter", () => {
  const svg = bank.render("card.essay-finding", { params: { value_2: 80, max: 130 } }).svg;
  const bar = /<rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="[\d.]+" rx="[\d.]+" fill="#6A9BCC" data-role="blue"\/>/.exec(svg);
  assert.ok(bar, "the second bar is a blue rect");
  assert.ok(Math.abs(Number(bar[1]) - (80 / 130) * 880) < 0.1, bar[1]);
  assert.match(svg, /data-slot="value_2"[^>]*>\+80%</);
  assert.throws(() => bank.render("card.essay-finding", { set: { value_2: "+80%" } }), (error) => error.code === "OPTION_VALUE_INVALID" && /derived/.test(error.message));
  assert.throws(() => bank.render("card.essay-finding", { params: { value_2: 400 } }), (error) => error.code === "OPTION_VALUE_INVALID");
});

test("copy that does not fit fails with a fix", () => {
  const long = bank.check(bank.render("cover.essay-hero", { set: { title_1: "这是一个长得放不下的标题行它会超出预算并且溢出" } }).svg);
  assert.ok(long.findings.some((f) => (f.rule === "text-overflow" || f.rule === "text-length") && f.slot === "title_1" && f.fix.length > 20), messages(long));
  const note = bank.check(bank.render("card.essay-note-figure", { set: { note_text: "这是很长的便签正文。".repeat(12) } }).svg);
  assert.ok(note.findings.some((f) => f.slot === "note_text"), messages(note));
});

test("the burst is crayon: one fill filter with a wobbling edge and a streaked paper-tooth alpha, scaled with the size, and the flow card has no filter on text", () => {
  for (const size of ["1600x900", "1920x1080"]) {
    const svg = bank.render("cover.essay-hero", { size }).svg;
    assert.match(svg, /<filter id="essay-crayon"[^>]*>(?=.*<feDisplacementMap)(?=.*operator="arithmetic")(?=.*<feComposite in="d" in2="m" operator="in"\/>)/, size);
    assert.match(svg, /<g filter="url\(#essay-crayon\)">/, size);
    assert.doesNotMatch(svg, /watercolour|soft-light/i, size);
  }
  // frequencies are per unit, so a 1.2x canvas divides them by 1.2 and the grain keeps its size
  const freq = (svg) => Number(/baseFrequency="([\d.]+)" numOctaves="2" seed="7"/.exec(svg)[1]);
  assert.ok(Math.abs(freq(bank.render("cover.essay-hero", { size: "1600x900" }).svg) / freq(bank.render("cover.essay-hero", { size: "1920x1080" }).svg) - 1.2) < 0.01);
  const flow = bank.render("card.essay-flow").svg;
  assert.match(flow, /<filter id="essay-line"/);
  assert.doesNotMatch(flow, /<text[^>]*filter=/);
  assert.doesNotMatch(flow, /id="essay-crayon"/, "the flow card draws no fill, so it carries no fill filter");
});

test("the flow card draws count icons joined by count - 1 clay arrows with one label each, and icon_start rotates the icons", () => {
  const marks = (svg) => ({
    icons: (svg.match(/<g transform="translate\([\d. ]+\) scale\([\d.]+\)"/g) || []).length,
    arrows: (svg.match(/stroke="#D97757" stroke-width="[\d.]+" stroke-linecap="round" stroke-linejoin="round"\/>/g) || []).length,
    labels: [...svg.matchAll(/data-slot="label_(\d)"/g)].map((m) => Number(m[1])),
  });
  for (const count of [3, 4, 5]) {
    const found = marks(bank.render("card.essay-flow", { params: { count } }).svg);
    assert.deepEqual(found, { icons: count, arrows: count - 1, labels: Array.from({ length: count }, (_, i) => i + 1) }, `count ${count}`);
  }
  const path0 = (svg) => /<path d="([^"]+)"\/><\/g>/.exec(svg)[1];
  const a = bank.render("card.essay-flow", { params: { icon_start: 0 } }).svg;
  assert.notEqual(path0(a), path0(bank.render("card.essay-flow", { params: { icon_start: 1 } }).svg));
  assert.equal(path0(a), path0(bank.render("card.essay-flow", { params: { icon_start: 5 % 5 } }).svg));
  assert.throws(() => bank.render("card.essay-flow", { params: { count: 6 } }), (error) => error.code === "OPTION_VALUE_INVALID");
  assert.throws(() => bank.render("card.essay-flow", { params: { count: 3 }, set: { label_4: "x" } }), (error) => error.code === "OPTION_VALUE_INVALID" && /not drawn/.test(error.message));
  const long = bank.check(bank.render("card.essay-flow", { set: { label_3: "这是一个长得放不下的节点标签文字" } }).svg);
  assert.ok(long.findings.some((f) => f.slot === "label_3"), messages(long));
});

test("every institute-essay default render passes the browser check too, and the dark theme of three of them (one Chrome)", { skip: SKIP, timeout: 600000 }, async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "institute-essay-browser-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const jobs = IDS.map((id) => ({ id })).concat(["cover.essay-hero", "card.essay-finding", "card.essay-flow"].map((id) => ({ id, params: { theme: "dark" } })));
  for (const result of await checkRenders(BROWSER, jobs, root)) assert.deepEqual(result.findings, [], result.name);
});

test("the HTML long-read kit is one self-contained page with a README, and names no organisation's marks", () => {
  const html = fs.readFileSync(path.join(KIT, "index.html"), "utf8");
  assert.ok(fs.existsSync(path.join(KIT, "README.md")));
  assert.match(fs.readFileSync(path.join(KIT, "README.md"), "utf8"), /institute-essay/);
  assert.doesNotMatch(html, /<script[^>]+src=|<img\b|@import|url\((?!#)/i, "no external scripts, images or imports");
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  assert.ok(links.every((tag) => /fonts\.(googleapis|gstatic)\.com/.test(tag)), `only font links: ${links.join(" ")}`);
  assert.doesNotMatch(html, /anthropic|claude|openai|deepmind|gemini/i);
  for (const token of ["--clay:#d97757", "#faf9f5", "#141413", "Source Serif 4", "Noto Serif SC", "grid", "feTurbulence", "id=\"cl\"", "pathLength", "id=\"story\"", "prefers-reduced-motion"]) assert.ok(html.toLowerCase().includes(token.toLowerCase()), token);
  const style = bank.loadStyle("institute-essay");
  assert.ok(style.examples.renders.some((r) => r.file === "examples/institute-essay-report-kit/index.html"));
});

test("the kit page passes the browser half of template check at 1440 and 390 wide, motion settled", { skip: SKIP, timeout: 600000 }, async () => {
  for (const result of await kitChecks()) {
    assert.deepEqual(result.findings, [], `${result.width}x${result.height}`);
    assert.equal(result.status, "passed", `${result.width}x${result.height}`);
  }
});
