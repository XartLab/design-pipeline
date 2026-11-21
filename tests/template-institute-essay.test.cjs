"use strict";

// The institute-essay style pack: the grammar of AI research institute long-form explainers and research
// essays, measured on two public reference pages (kept private, never shipped). Five templates (hero with a
// seeded pixel burst, finding with watercolour bars, figure with a sticky note, pull quote, scenario cards),
// each rendered from parameters with original copy, and the HTML long-read kit that proves the grammar.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const bank = require("../skill/tools/template-bank/bank.cjs");

const REPO = path.join(__dirname, "..");
const CLI = path.join(REPO, "skill", "scripts", "designer-pipeline.cjs");
const KIT = path.join(REPO, "examples", "institute-essay-report-kit");
const CATALOG = JSON.parse(fs.readFileSync(path.join(REPO, "skill", "references", "fonts", "catalog.json"), "utf8"));
const IDS = ["card.essay-finding", "card.essay-note-figure", "card.essay-pullquote", "cover.essay-hero", "doc.essay-scenarios"];

const messages = (report) => JSON.stringify(report.findings.map((f) => `${f.rule}:${f.slot}: ${f.message}`));
function cli(root, ...args) {
  const child = spawnSync(process.execPath, [CLI, ...args, "--root", root, "--json"], { encoding: "utf8", windowsHide: true, timeout: 600000, maxBuffer: 64 << 20 });
  let payload = null;
  try { payload = JSON.parse(child.stdout); } catch { payload = null; }
  return { status: child.status, payload, stderr: child.stderr };
}
const BROWSER = (() => {
  try {
    const puppeteerModule = process.env.DESIGN_PIPELINE_PUPPETEER_MODULE || path.dirname(require.resolve("puppeteer-core/package.json"));
    const { resolveBrowser } = require("../skill/scripts/browser-locate.cjs");
    return { puppeteerModule, chrome: resolveBrowser() };
  } catch (error) {
    return { skip: `browser unavailable: ${error.message}` };
  }
})();
const CI_SKIP = process.env.GITHUB_ACTIONS === "true" && "text-occluded differs on the CI runner (#305)";

test("institute-essay names its case and lineage, borrows grammar not assets, names no organisation and resolves its fonts through the catalog", () => {
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

test("every institute-essay default render passes the browser check too, and the dark theme of two of them", { skip: BROWSER.skip || CI_SKIP, timeout: 1200000 }, (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "institute-essay-browser-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const id of IDS) {
    for (const theme of id === "cover.essay-hero" || id === "card.essay-finding" ? ["light", "dark"] : ["light"]) {
      const result = cli(root, "template", "render", id, "--param", `theme=${theme}`, "-o", `${id}-${theme}.svg`, "--chrome", BROWSER.chrome, "--puppeteer-module", BROWSER.puppeteerModule);
      assert.equal(result.status, 0, `${id} ${theme}: ${JSON.stringify(result.payload?.check?.findings || result.payload?.error || result.stderr)}`);
      assert.equal(result.payload.check.status, "passed", `${id} ${theme}`);
    }
  }
});

test("the HTML long-read kit is one self-contained page with a README, and names no organisation's marks", () => {
  const html = fs.readFileSync(path.join(KIT, "index.html"), "utf8");
  assert.ok(fs.existsSync(path.join(KIT, "README.md")));
  assert.match(fs.readFileSync(path.join(KIT, "README.md"), "utf8"), /institute-essay/);
  assert.doesNotMatch(html, /<script[^>]+src=|<img\b|@import|url\((?!#)/i, "no external scripts, images or imports");
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  assert.ok(links.every((tag) => /fonts\.(googleapis|gstatic)\.com/.test(tag)), `only font links: ${links.join(" ")}`);
  assert.doesNotMatch(html, /anthropic|claude|openai|deepmind|gemini/i);
  for (const token of ["--clay:#d97757", "#faf9f5", "#141413", "Source Serif 4", "Noto Serif SC", "grid", "feTurbulence"]) assert.ok(html.toLowerCase().includes(token.toLowerCase()), token);
  const style = bank.loadStyle("institute-essay");
  assert.ok(style.examples.renders.some((r) => r.file === "examples/institute-essay-report-kit/index.html"));
});

test("the kit page passes the browser half of template check at 1440 and 390 wide", { skip: BROWSER.skip || CI_SKIP, timeout: 1200000 }, () => {
  for (const size of ["1440x6000", "390x6000"]) {
    const result = cli(REPO, "template", "check", path.join(KIT, "index.html"), "--browser", "--size", size, "--chrome", BROWSER.chrome, "--puppeteer-module", BROWSER.puppeteerModule);
    assert.equal(result.status, 0, `${size}: ${JSON.stringify(result.payload?.findings || result.payload?.error || result.stderr)}`);
    assert.equal(result.payload.status, "passed", size);
  }
});
