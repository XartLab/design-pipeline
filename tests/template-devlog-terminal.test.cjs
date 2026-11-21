"use strict";

// The devlog-terminal style pack: the grammar of a developer technical-writing blog that speaks in
// terminal conventions, measured privately in Chrome and built here from our own copy and glyphs.
// Five templates: the post index, the article with its rail, the article header, the figure frame
// and the dot-matrix field. Each renders from parameters and passes both halves of the check; the HTML note
// kit proves the grammar on a whole page. The browser checks share their Chromes
// (tests/helpers/kit-browser-check.cjs): the kit's two widths run at once from the first test on and the
// default renders share one Chrome.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const bank = require("../skill/tools/template-bank/bank.cjs");
const measure = require("../skill/tools/template-bank/measure.cjs");
const { GLYPHS, GLYPH_NAMES } = require("../skill/tools/template-bank/layouts-devlog.cjs");
const { locateBrowser, CI_SKIP, checkKit, checkRenders } = require("./helpers/kit-browser-check.cjs");

const CLI = path.join(__dirname, "..", "skill", "scripts", "designer-pipeline.cjs");
const KIT = path.join(__dirname, "..", "examples", "devlog-terminal-note-kit");
const CATALOG = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "skill", "references", "fonts", "catalog.json"), "utf8"));
const IDS = ["banner.devlog-dotfield", "card.devlog-fig", "ui.devlog-article", "ui.devlog-article-header", "ui.devlog-index"];

const messages = (report) => JSON.stringify(report.findings.map((f) => `${f.rule}:${f.slot}: ${f.message}`));
function cli(root, ...args) {
  const child = spawnSync(process.execPath, [CLI, ...args, "--root", root, "--json"], { encoding: "utf8", windowsHide: true, timeout: 600000, maxBuffer: 64 << 20 });
  let payload = null;
  try { payload = JSON.parse(child.stdout); } catch { payload = null; }
  return { status: child.status, payload, stderr: child.stderr };
}
const BROWSER = locateBrowser();
const SKIP = BROWSER.skip || CI_SKIP;
// The kit check is the slow part (a screenshot per text unit): start both widths with the first test so
// they overlap the static tests, and let the kit test await the result.
let kitRun = null;
const kitChecks = () => (kitRun ||= checkKit(BROWSER, path.join(KIT, "index.html"), [1440, 390]));

test("devlog-terminal names its case and lineage, borrows grammar not assets, and resolves its fonts through the catalog", () => {
  if (!SKIP) kitChecks().catch(() => {});
  const style = bank.loadStyle("devlog-terminal");
  assert.match(style.provenance.borrow, /^Borrow grammar, never assets\./);
  assert.match(style.provenance.lineage, /stays private and is not shipped/);
  assert.match(style.provenance.lineage, /Never borrowed: .*mascot/);
  assert.ok(style.layout.grammar.length >= 6 && style.motion.grammar.length);
  assert.ok(style.checks.guidance.some((line) => /^64 px distinctiveness \(guidance/.test(line)));
  assert.ok(style.checks.guidance.some((line) => /never draw the reference blog's mascot/i.test(line)));
  assert.equal(style.checks.browserOnRender, true);
  for (const recipe of style.materials.recipes) assert.match(recipe, /materials (request|process)/);
  const families = new Set(CATALOG.families.map((f) => f.family));
  for (const [role, spec] of Object.entries(style.fonts.roles)) {
    assert.ok(spec.stack.length >= 3 && spec.stack.some((family) => families.has(family)), `${role}: ${spec.stack.join(" > ")}`);
  }
  assert.deepEqual(Object.keys(style.fonts.roles), ["mono", "monom", "sans", "title"]);
  for (const face of style.fonts.faces) assert.ok(/^SIL OFL/.test(face.licence) && /\/ofl\//.test(face.source), `${face.family} names an OFL source`);
  assert.equal(style.fonts.bundled, false);
  // the measured palette
  const pal = Object.fromEntries(Object.entries(style.palette).map(([role, spec]) => [role, spec.value]));
  assert.deepEqual(pal, { ground: "#141413", ink: "#FAF9F5", body: "#B0AEA5", mute: "#87867F", dim: "#5E5D59", hair: "#292927", clay: "#D97757" });
  assert.deepEqual(bank.templateIds().filter((id) => bank.loadManifest(id).style === "devlog-terminal"), IDS);
  const listed = cli(fs.mkdtempSync(path.join(os.tmpdir(), "devlog-")), "template", "list", "--style", "devlog-terminal");
  assert.equal(listed.status, 0, JSON.stringify(listed.payload));
  assert.deepEqual(listed.payload.styles[0].templates, IDS);
  // the pack draws its own glyphs: nine rows of nine pixels each
  for (const name of GLYPH_NAMES) {
    assert.equal(GLYPHS[name].length, 9, name);
    for (const row of GLYPHS[name]) assert.match(row, /^[#.]{9}$/, name);
  }
});

test("devlog-terminal templates pass the static check at every size and for 50 seeds, and in their variants", () => {
  for (const id of IDS) {
    for (const size of bank.loadManifest(id).sizes) {
      const report = bank.check(bank.render(id, { size }).svg);
      assert.equal(report.status, "passed", `${id} ${size}: ${messages(report)}`);
    }
    for (let seed = 1; seed <= 50; seed += 1) {
      const report = bank.check(bank.render(id, { seed }).svg);
      assert.equal(report.status, "passed", `${id} seed ${seed}: ${messages(report)}`);
    }
  }
  const variants = [
    ["ui.devlog-index", { rows: 6, active: 3, current: 2, glyph: "bolt", glyph_offset: 3 }, {}],
    ["ui.devlog-index", { rows: 8 }, { row_title_8: "Eight rows still fit above the load more button" }],
    ["ui.devlog-article", { progress: 100, current: 7, tree_items: 7 }, {}],
    ["ui.devlog-article", { progress: 0, current: 1, tree_items: 3 }, {}],
    ["ui.devlog-article-header", { glyph: "chart" }, {}],
    ["card.devlog-fig", { label_w: 144, frame: false }, { label: "FIG B" }],
    ["banner.devlog-dotfield", { seed: 999, density: 0.75 }, {}],
    ["banner.devlog-dotfield", { seed: 1, density: 0.35 }, {}],
  ];
  for (const [id, params, set] of variants) {
    const report = bank.check(bank.render(id, { params, set }).svg);
    assert.equal(report.status, "passed", `${id} ${JSON.stringify(params)}: ${messages(report)}`);
  }
});

test("clay appears only as square tiles with a pixel glyph, never as text or a wide fill", () => {
  for (const id of IDS) {
    const svg = bank.render(id).svg;
    assert.doesNotMatch(svg, /<text[^>]*fill="#D97757"/i, `${id}: clay text`);
    const clay = [...svg.matchAll(/<(\w+)[^>]*fill="#D97757"[^>]*>/gi)];
    for (const [tag, name] of clay) {
      assert.equal(name, "rect", `${id}: clay is a rect`);
      const w = Number(/width="([\d.]+)"/.exec(tag)[1]); const h = Number(/height="([\d.]+)"/.exec(tag)[1]);
      assert.equal(w, h, `${id}: clay tiles are square`);
      assert.ok(w <= 192, `${id}: no clay slab`);
    }
  }
  assert.equal([...bank.render("ui.devlog-index").svg.matchAll(/data-role="clay"/g)].length, 1 + 7);
  assert.equal([...bank.render("ui.devlog-index", { params: { rows: 6 } }).svg.matchAll(/data-role="clay"/g)].length, 1 + 6);
  assert.equal([...bank.render("ui.devlog-article").svg.matchAll(/data-role="clay"/g)].length, 0);
  // the inverted button: ink fill, ground text, square corners
  const nav = bank.render("ui.devlog-index").svg;
  assert.match(nav, /<rect [^>]*fill="#FAF9F5" data-role="ink"\/>/);
  assert.match(nav, /data-slot="cta"[^>]*fill="#141413"/);
  assert.doesNotMatch(nav, /\brx="/);
});

test("the article's progress bar and the dot field follow their parameters", () => {
  const blocks = (svg) => {
    const body = /<g data-deco="1"><g fill="#B0AEA5">(.*?)<\/g><g fill="#5E5D59">(.*?)<\/g><\/g>/.exec(svg);
    return [(body[1].match(/<rect/g) || []).length, (body[2].match(/<rect/g) || []).length];
  };
  assert.deepEqual(blocks(bank.render("ui.devlog-article").svg), [8, 12]);
  assert.deepEqual(blocks(bank.render("ui.devlog-article", { params: { progress: 100 } }).svg), [20, 0]);
  assert.deepEqual(blocks(bank.render("ui.devlog-article", { params: { progress: 0 } }).svg), [0, 20]);
  assert.match(bank.render("ui.devlog-article", { params: { progress: 73 } }).svg, /data-slot="percent"[^>]*>73%</);
  assert.throws(() => bank.render("ui.devlog-article", { set: { percent: "5%" } }), (error) => error.code === "OPTION_VALUE_INVALID" && /derived/.test(error.message));
  assert.throws(() => bank.render("ui.devlog-article", { params: { progress: 101 } }), (error) => error.code === "OPTION_VALUE_INVALID");
  // a seed is a field: the same seed renders the same bytes, another seed another field, and the disc around the mascot stays clear
  const a = bank.render("banner.devlog-dotfield", { params: { seed: 11 } }).svg;
  assert.equal(a, bank.render("banner.devlog-dotfield", { params: { seed: 11 } }).svg);
  assert.notEqual(a, bank.render("banner.devlog-dotfield", { params: { seed: 12 } }).svg);
  assert.ok((a.match(/<circle/g) || []).length > 200);
  for (const [, cx, cy] of a.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)"/g)) assert.ok(Math.hypot(cx - 720, cy - 240) >= 118, `dot at ${cx},${cy} inside the mascot disc`);
  assert.match(a, /data-slot="field_label"[^>]*>FIELD 011</);
  assert.equal(new Set((a.match(/<circle[^>]* r="([\d.]+)"/g) || []).map((c) => /r="([\d.]+)"/.exec(c)[1])).size, 4, "four dot sizes");
});

test("index rows are parameters, indexed slots take copy, and CJK copy leaves the mono roles whole", () => {
  for (const rows of [6, 7, 8]) {
    const svg = bank.render("ui.devlog-index", { params: { rows } }).svg;
    assert.equal([...svg.matchAll(/data-slot="row_title_\d+"/g)].length, rows);
    assert.equal(bank.check(svg).status, "passed", `rows ${rows}`);
  }
  assert.throws(() => bank.render("ui.devlog-index", { params: { rows: 6 }, set: { row_title_7: "x" } }), (error) => error.code === "OPTION_VALUE_INVALID" && /not drawn/.test(error.message));
  assert.throws(() => bank.render("ui.devlog-index", { params: { rows: 9 } }), (error) => error.code === "OPTION_VALUE_INVALID");
  const cjk = bank.render("ui.devlog-index", { set: { nav_2: "[M] 模组", row_date_1: "2026年11月", tab_2: "工程", feature_title: "让测试框架解释它自己的失败" } }).svg;
  assert.match(cjk, /data-slot="nav_2"[^>]*data-font-role="sans"/);
  assert.match(cjk, /data-slot="row_date_1"[^>]*data-font-role="sans"/);
  assert.match(cjk, /data-slot="tab_2"[^>]*data-font-role="sans"/);
  assert.match(cjk, /data-slot="nav_1"[^>]*data-font-role="mono"/);
  assert.match(cjk, /data-slot="feature_title"[^>]*data-font-role="title"/);
  assert.equal(bank.check(cjk).status, "passed", messages(bank.check(cjk)));
  const long = bank.check(bank.render("ui.devlog-index", { set: { row_title_1: "这是一条长得放不下的文章标题，它会超出预算并且溢出它的框，需要缩短，再多写几句让它超过五十六个字的字数预算，这样两条规则都会报出来" } }).svg);
  assert.ok(long.findings.some((f) => f.rule === "text-length" && f.slot === "row_title_1"), messages(long));
  assert.ok(long.findings.some((f) => f.rule === "text-overflow" && f.slot === "row_title_1"), messages(long));
});

test("a list item reads as one run: the continuation starts about one space after its bold lead term", () => {
  const gaps = (svg) => [1, 2, 3].map((i) => {
    const attrs = (slot) => new RegExp(`<text data-slot="${slot}"[^>]*? x="([\\d.]+)"[^>]*font-size="([\\d.]+)"[^>]*>([^<]*)<`).exec(svg);
    const [, lx, size, lead] = attrs(`item_lead_${i}`); const [, rx] = attrs(`item_rest_${i}`);
    return { gap: Number(rx) - Number(lx) - measure.textWidth(lead, Number(size), 0, { weight: 600 }), em: Number(size) };
  });
  const cjk = { item_lead_1: "固定时钟", item_lead_2: "写明顺序", item_lead_3: "记录种子", item_rest_1: "让每次运行从同一秒开始。", item_rest_2: "两步必须依次发生时。", item_rest_3: "写在报告的第一行。" };
  for (const [name, svg] of [["default", bank.render("ui.devlog-article").svg], ["CJK", bank.render("ui.devlog-article", { set: cjk }).svg], ["2x", bank.render("ui.devlog-article", { size: "2880x1800" }).svg]]) {
    for (const { gap, em } of gaps(svg)) assert.ok(gap > -0.2 * em && gap <= 0.5 * em, `${name}: lead to continuation gap ${gap.toFixed(1)} (${(gap / em).toFixed(2)} em)`);
  }
  assert.equal(bank.check(bank.render("ui.devlog-article", { set: cjk }).svg).status, "passed");
});

test("every devlog-terminal default render passes the browser check too (one Chrome)", { skip: SKIP, timeout: 600000 }, async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "devlog-browser-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const result of await checkRenders(BROWSER, IDS.map((id) => ({ id })), root)) assert.deepEqual(result.findings, [], result.name);
});

test("the HTML note kit is one self-contained page with a README, carries its motion with a reduced-motion fallback, and names no organisation", () => {
  const html = fs.readFileSync(path.join(KIT, "index.html"), "utf8");
  const readme = fs.readFileSync(path.join(KIT, "README.md"), "utf8");
  assert.match(readme, /devlog-terminal/);
  assert.doesNotMatch(html, /<script[^>]+src=|<img\b|@import|url\((?!#)/i, "no external scripts, images or imports");
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  assert.ok(links.every((tag) => /fonts\.(googleapis|gstatic)\.com/.test(tag)), `only font links: ${links.join(" ")}`);
  assert.doesNotMatch(html, /anthropic|claude|openai|deepmind|gemini/i);
  for (const token of ["--bg:#141413", "--ink:#faf9f5", "--clay:#d97757", "JetBrains Mono", "Noto Sans SC", "prefers-reduced-motion", "IntersectionObserver", "<canvas", "[H]"]) assert.ok(html.toLowerCase().includes(token.toLowerCase()), token);
  const style = bank.loadStyle("devlog-terminal");
  assert.ok(style.examples.renders.some((r) => r.file === "examples/devlog-terminal-note-kit/index.html"));
  assert.ok(style.motion.grammar.some((line) => /types itself/.test(line)) && style.motion.grammar.some((line) => /prefers-reduced-motion/.test(line)));
});

test("the note kit passes the browser half of template check at 1440 and 390 wide, motion settled", { skip: SKIP, timeout: 600000 }, async () => {
  for (const result of await kitChecks()) {
    assert.deepEqual(result.findings, [], `${result.width}x${result.height}`);
    assert.equal(result.status, "passed", `${result.width}x${result.height}`);
  }
});
