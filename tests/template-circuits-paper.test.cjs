"use strict";

// The circuits-paper style pack: the grammar of an interactive interpretability research paper thread
// (a Distill-lineage scientific article), measured on public reference pages (kept private, never shipped).
// Five templates (paper title and byline, figure with a margin note, feature browser with token strips,
// attribution graph, contents with a footnote card), each rendered from parameters with original copy, and
// the HTML paper kit that proves the grammar. The browser checks share their Chromes
// (tests/helpers/kit-browser-check.cjs): the two kit widths run at once from the first test on, and the
// default renders share one Chrome.

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
const KIT = path.join(REPO, "examples", "circuits-paper-kit");
const CATALOG = JSON.parse(fs.readFileSync(path.join(REPO, "skill", "references", "fonts", "catalog.json"), "utf8"));
const IDS = ["card.circuits-features", "card.circuits-figure", "card.circuits-graph", "cover.circuits-title", "doc.circuits-contents"];

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

test("circuits-paper names its case and lineage, borrows grammar not assets, names no organisation and resolves its fonts through the catalog", () => {
  if (!SKIP) kitChecks().catch(() => {});
  const style = bank.loadStyle("circuits-paper");
  assert.match(style.provenance.borrow, /^Borrow grammar, never assets\./);
  assert.match(style.provenance.lineage, /stay private and are not shipped/);
  assert.match(style.provenance.lineage, /Distill-lineage/);
  assert.ok(style.layout.grammar.length >= 6 && style.motion.grammar.length);
  assert.ok(style.checks.guidance.some((line) => /^64 px distinctiveness \(guidance/.test(line)));
  assert.ok(style.checks.guidance.some((line) => /faint grey #808080 is for large type and decoration only/.test(line)));
  assert.equal(style.checks.browserOnRender, true);
  for (const recipe of style.materials.recipes) assert.match(recipe, /materials (fetch|cut|process|generate)/);
  const families = new Set(CATALOG.families.map((f) => f.family));
  for (const [role, spec] of Object.entries(style.fonts.roles)) {
    assert.ok(spec.stack.length >= 2 && spec.stack.some((family) => families.has(family)), `${role}: ${spec.stack.join(" > ")}`);
  }
  assert.deepEqual(Object.keys(style.fonts.roles), ["sans", "mono", "serif"]);
  assert.equal(style.palette.white.value, "#FFFFFF");
  assert.equal(style.palette.maroon.value, "#633636");
  assert.equal(style.palette.hot_mid.value, "#FF8D47");
  const all = JSON.stringify(style) + IDS.map((id) => JSON.stringify(bank.loadManifest(id)) + fs.readFileSync(path.join(bank.TEMPLATES_ROOT, id, "spec.md"), "utf8") + fs.readFileSync(path.join(bank.TEMPLATES_ROOT, id, "template.svg"), "utf8")).join("");
  assert.doesNotMatch(all, /anthropic|claude|openai|deepmind|google ai|\bmeta ai\b|\bgpt\b|gemini|\bllama\b|transformer-circuits/i);
  assert.deepEqual(bank.templateIds().filter((id) => bank.loadManifest(id).style === "circuits-paper"), IDS);
  const listed = cli(fs.mkdtempSync(path.join(os.tmpdir(), "circuits-paper-")), "template", "list", "--style", "circuits-paper");
  assert.equal(listed.status, 0, JSON.stringify(listed.payload));
  assert.deepEqual(listed.payload.styles[0].templates, IDS);
});

test("circuits-paper templates pass the static check at every size and for 50 seeds, and in their variants", () => {
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
    ["card.circuits-graph", { layers: 2, cols: 3, seed: 9999 }, {}],
    ["card.circuits-graph", { layers: 4, cols: 5, seed: 3 }, {}],
    ["card.circuits-features", { rows: 3, seed: 1 }, {}],
    ["card.circuits-features", { rows: 5, seed: 8888 }, {}],
    ["card.circuits-figure", { layers: 1, tokens: 3 }, {}],
    ["card.circuits-figure", { layers: 3, tokens: 5 }, {}],
    ["doc.circuits-contents", { count: 5, active: 4 }, {}],
    ["doc.circuits-contents", { count: 8, active: 7 }, {}],
    ["cover.circuits-title", {}, { title_1: "稀疏特征", title_2: "与归因图", authors: "示例作者甲*、示例作者乙" }],
  ];
  for (const [id, params, set] of variants) {
    const report = bank.check(bank.render(id, { params, set }).svg);
    assert.equal(report.status, "passed", `${id} ${JSON.stringify(params)}: ${messages(report)}`);
  }
});

test("the attribution graph is seeded: same seed, same render; layers and columns set the node grid", () => {
  const a = bank.render("card.circuits-graph", { params: { seed: 7 } }).svg;
  assert.equal(a, bank.render("card.circuits-graph", { params: { seed: 7 } }).svg);
  assert.notEqual(a, bank.render("card.circuits-graph", { params: { seed: 8 } }).svg);
  for (const [layers, cols] of [[2, 3], [3, 4], [4, 5]]) {
    const svg = bank.render("card.circuits-graph", { params: { layers, cols } }).svg;
    assert.equal((svg.match(/<circle [^>]*data-role="(?:node|maroon)"/g) || []).length, layers * cols * 4, `${layers} x ${cols}`);
    assert.deepEqual([...svg.matchAll(/data-slot="tok_(\d)"/g)].map((m) => Number(m[1])), Array.from({ length: cols }, (_, i) => i + 1));
    assert.deepEqual([...svg.matchAll(/data-slot="layer_(\d)"/g)].map((m) => Number(m[1])), Array.from({ length: layers }, (_, i) => i + 1));
  }
  assert.throws(() => bank.render("card.circuits-graph", { params: { cols: 6 } }), (error) => error.code === "OPTION_VALUE_INVALID");
  assert.throws(() => bank.render("card.circuits-graph", { params: { layers: 2 }, set: { layer_3: "x" } }), (error) => error.code === "OPTION_VALUE_INVALID" && /not drawn/.test(error.message));
});

test("token rows draw one text per token, highlighted by activation, and the list values come from the seed", () => {
  const svg = bank.render("card.circuits-features", { params: { rows: 3, seed: 17 } }).svg;
  const row = (n) => [...svg.matchAll(new RegExp(`<text [^>]*data-slot="ex_${n}"[^>]*>([^<]*)</text>`, "g"))].map((m) => m[1]);
  assert.deepEqual(row(1), ["央行", "宣布", "下调", "政策", "利率", "债市", "走强"]);
  assert.equal(row(4).length, 0, "rows=3 draws no fourth example");
  assert.ok(/data-role="hot_hi"/.test(svg), "every example has a peak token in the strongest orange");
  assert.ok(/fill="#000000" data-role="onhot"/.test(svg), "text on a highlight is black");
  assert.notEqual(svg, bank.render("card.circuits-features", { params: { rows: 3, seed: 18 } }).svg);
  const vals = [...svg.matchAll(/data-slot="val_(\d)"[^>]*>([\d.]+)</g)].map((m) => Number(m[2]));
  assert.equal(vals.length, 5);
  assert.ok(vals.every((v, i) => i === 0 || v < vals[i - 1]), `ranked values fall: ${vals}`);
  assert.throws(() => bank.render("card.circuits-features", { set: { val_1: "0.99" } }), (error) => error.code === "OPTION_VALUE_INVALID" && /derived/.test(error.message));
  const dark = bank.render("card.circuits-features", { params: { theme: "dark" } }).svg;
  assert.match(dark, /fill="#141414"/);
  assert.match(dark, /fill="#000000" data-role="onhot"/, "black on orange in the dark theme too");
});

test("copy that does not fit fails with a fix", () => {
  const long = bank.check(bank.render("cover.circuits-title", { set: { title_1: "这是一个长得放不下的标题行它会超出预算并且溢出画布边缘宽度" } }).svg);
  assert.ok(long.findings.some((f) => (f.rule === "text-overflow" || f.rule === "text-length") && f.slot === "title_1" && f.fix.length > 20), messages(long));
  const row = bank.check(bank.render("card.circuits-features", { set: { ex_1: "央行 宣布 下调 政策 利率 债市 走强 并带动 全球 市场 同步 上涨 行情" } }).svg);
  assert.ok(row.findings.some((f) => f.slot === "ex_1"), messages(row));
  const note = bank.check(bank.render("card.circuits-figure", { set: { margin_text: "这是很长的边注正文。".repeat(12) } }).svg);
  assert.ok(note.findings.some((f) => f.slot === "margin_text"), messages(note));
});

test("every circuits-paper default render passes the browser check too, and the dark theme of three of them (one Chrome)", { skip: SKIP, timeout: 600000 }, async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "circuits-paper-browser-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const jobs = IDS.map((id) => ({ id })).concat(["card.circuits-features", "card.circuits-graph", "doc.circuits-contents"].map((id) => ({ id, params: { theme: "dark" } })));
  for (const result of await checkRenders(BROWSER, jobs, root)) assert.deepEqual(result.findings, [], result.name);
});

test("the HTML paper kit is one self-contained page with a README, and names no organisation's marks", () => {
  const html = fs.readFileSync(path.join(KIT, "index.html"), "utf8");
  assert.ok(fs.existsSync(path.join(KIT, "README.md")));
  assert.match(fs.readFileSync(path.join(KIT, "README.md"), "utf8"), /circuits-paper/);
  assert.doesNotMatch(html, /<script[^>]+src=|<img\b|@import|url\((?!#)/i, "no external scripts, images or imports");
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  assert.ok(links.every((tag) => /fonts\.(googleapis|gstatic)\.com/.test(tag)), `only font links: ${links.join(" ")}`);
  assert.doesNotMatch(html, /anthropic|claude|openai|deepmind|gemini|transformer-circuits/i);
  for (const token of ["--maroon:light-dark(#633636", "#ffae72", "#ff8d47", "#ff6927", "IBM Plex Sans", "Roboto Mono", "STIX Two Text", "Noto Sans SC", "id=\"fig1\"", "id=\"fig2\"", "id=\"fig3\"", "id=\"fig4\"", "type=\"range\"", "class=\"eq\"", "data-n=\"1\"", "data-r=\"1\"", "pathLength", "prefers-reduced-motion", "class=\"mn\"", "class=\"toc\"", "示例"]) assert.ok(html.toLowerCase().includes(token.toLowerCase()), token);
  assert.equal((html.match(/type="range"/g) || []).length, 2, "two sliders: the edge threshold and the sparsity coefficient");
  const style = bank.loadStyle("circuits-paper");
  assert.ok(style.examples.renders.some((r) => r.file === "examples/circuits-paper-kit/index.html"));
});

test("the kit page passes the browser half of template check at 1440 and 390 wide, motion settled", { skip: SKIP, timeout: 600000 }, async () => {
  for (const result of await kitChecks()) {
    assert.deepEqual(result.findings, [], `${result.width}x${result.height}`);
    assert.equal(result.status, "passed", `${result.width}x${result.height}`);
  }
});
