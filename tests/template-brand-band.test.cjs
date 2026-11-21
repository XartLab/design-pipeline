"use strict";

// The brand-band style pack: the grammar of an AI-lab corporate site (ivory, oat and near-black bands, an
// editorial serif, flat colour fields with one hand-drawn picture), measured on public pages kept private and
// never shipped. Six templates, the eight-subject illustration kit drawn in code (marker ribbons, flat
// misregistered fills), and the HTML product-site kit that proves the grammar. The browser checks share their
// Chromes (tests/helpers/kit-browser-check.cjs): both kit widths start with the first test and the default
// renders share one Chrome. Static runs stay small: a fast check that cannot finish in a minute is a bug.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const bank = require("../skill/tools/template-bank/bank.cjs");
const ill = require("../skill/tools/template-bank/illustrations-band.cjs");
const { locateBrowser, CI_SKIP, checkKit, checkRenders } = require("./helpers/kit-browser-check.cjs");

const REPO = path.join(__dirname, "..");
const CLI = path.join(REPO, "skill", "scripts", "designer-pipeline.cjs");
const KIT = path.join(REPO, "examples", "brand-band-site-kit");
const CATALOG = JSON.parse(fs.readFileSync(path.join(REPO, "skill", "references", "fonts", "catalog.json"), "utf8"));
const IDS = ["banner.band-black-statement", "banner.band-cta-row", "card.band-features", "card.band-social", "cover.band-article", "kv.band-hero"];
const SUBJECTS = ["hand-graph", "seedling", "book", "magnifier", "spark-hands", "path", "candles", "compass"];
const FIELDS = ["sage", "blush", "lilac", "sky", "sand"];

const messages = (report) => JSON.stringify(report.findings.map((f) => `${f.rule}:${f.slot}: ${f.message}`));
function cli(root, ...args) {
  const child = spawnSync(process.execPath, [CLI, ...args, "--root", root, "--json"], { encoding: "utf8", windowsHide: true, timeout: 600000, maxBuffer: 64 << 20 });
  let payload = null;
  try { payload = JSON.parse(child.stdout); } catch { payload = null; }
  return { status: child.status, payload, stderr: child.stderr };
}
const BROWSER = locateBrowser();
const SKIP = BROWSER.skip || CI_SKIP;
// The kit check is the slow part: start both widths as soon as the first test runs so they overlap the static tests.
let kitRun = null;
const kitChecks = () => (kitRun ||= checkKit(BROWSER, path.join(KIT, "index.html"), [1440, 390]));

test("brand-band names its case and lineage, borrows grammar not assets, names no organisation and resolves its fonts through the catalog", () => {
  if (!SKIP) kitChecks().catch(() => {});
  const style = bank.loadStyle("brand-band");
  assert.match(style.provenance.borrow, /^Borrow grammar, never assets\./);
  assert.match(style.provenance.lineage, /stay private and are not shipped/);
  assert.ok(style.layout.grammar.length >= 6 && style.motion.grammar.length);
  assert.ok(style.checks.guidance.some((line) => /^64 px distinctiveness \(guidance/.test(line)));
  assert.equal(style.checks.browserOnRender, true);
  for (const recipe of style.materials.recipes) assert.match(recipe, /materials (fetch|cut|process|generate)/);
  const families = new Set(CATALOG.families.map((f) => f.family));
  for (const [role, spec] of Object.entries(style.fonts.roles)) {
    assert.ok(spec.stack.length >= 2 && spec.stack.some((family) => families.has(family)), `${role}: ${spec.stack.join(" > ")}`);
  }
  assert.equal(style.palette.ivory.value, "#FAF9F5");
  assert.equal(style.palette.night.value, "#0D0C0B");
  assert.equal(style.palette.oat.value, "#F0EEE6");
  const all = JSON.stringify(style) + IDS.map((id) => JSON.stringify(bank.loadManifest(id)) + fs.readFileSync(path.join(bank.TEMPLATES_ROOT, id, "spec.md"), "utf8") + fs.readFileSync(path.join(bank.TEMPLATES_ROOT, id, "template.svg"), "utf8")).join("");
  assert.doesNotMatch(all, /anthropic|claude|openai|deepmind|google ai|\bmeta ai\b|\bgpt\b|gemini|\bllama\b/i);
  assert.deepEqual(bank.templateIds().filter((id) => bank.loadManifest(id).style === "brand-band"), IDS);
  const listed = cli(fs.mkdtempSync(path.join(os.tmpdir(), "brand-band-")), "template", "list", "--style", "brand-band");
  assert.equal(listed.status, 0, JSON.stringify(listed.payload));
  assert.deepEqual(listed.payload.styles[0].templates, IDS);
});

test("the illustration kit is eight original subjects drawn as marker ribbons and flat fills, deterministic, with a centre line per stroke", () => {
  assert.deepEqual([...ill.IDS].sort(), [...SUBJECTS].sort());
  for (const id of ill.IDS) {
    const a = ill.items(id); const b = ill.items(id);
    assert.deepEqual(a, b, `${id} is deterministic`);
    const strokes = a.filter((it) => it.type === "stroke"); const fills = a.filter((it) => it.type === "fill");
    assert.ok(strokes.length >= 4 && fills.length >= 1, `${id}: ${strokes.length} strokes, ${fills.length} fills`);
    for (const it of strokes) { assert.match(it.d, /^M[-\d. L]+Z$/); assert.match(it.c, /^M[-\d. L]+$/); }
    const svg = ill.svgBody(id, { paint: { paper: "#FAF9F5", clay: "#D97757", olive: "#788C5D", sky: "#6A9BCC" } });
    assert.doesNotMatch(svg, /stroke=|stroke-width/, "strokes are filled ribbons, not constant-width lines");
    assert.ok(svg.length < 24000, `${id} stays small (${svg.length})`);
  }
  // a ribbon's width varies along its length: its outline is not a constant-width offset of its centre line
  const r = ill.ribbon([[0, 0], [60, 4], [120, 0], [180, 6]], { w: 8, seed: 3 });
  const pts = r.d.slice(1, -1).split("L").map((p) => p.split(" ").map(Number));
  const half = pts.slice(0, pts.length / 2).map(([x, y], i) => Math.abs(y - pts[pts.length - 1 - i][1]));
  assert.ok(Math.max(...half) - Math.min(...half) > 2, `width varies (${Math.min(...half).toFixed(1)}-${Math.max(...half).toFixed(1)})`);
});

test("brand-band templates pass the static check at every size, every picture and field, and for 50 seeds", () => {
  const started = Date.now();
  for (const id of IDS) {
    for (const size of bank.loadManifest(id).sizes) {
      const report = bank.check(bank.render(id, { size }).svg);
      assert.equal(report.status, "passed", `${id} ${size}: ${messages(report)}`);
    }
  }
  for (const subject of [0, 1, 2, 3, 4, 5, 6, 7]) {
    for (const field of FIELDS) {
      const id = ["kv.band-hero", "banner.band-black-statement", "cover.band-article", "card.band-social"][(subject + FIELDS.indexOf(field)) % 4];
      const report = bank.check(bank.render(id, { params: { subject, field } }).svg);
      assert.equal(report.status, "passed", `${id} subject ${subject} ${field}: ${messages(report)}`);
    }
  }
  for (let seed = 1; seed <= 50; seed += 1) {
    const id = IDS[seed % IDS.length];
    const report = bank.check(bank.render(id, { seed }).svg);
    assert.equal(report.status, "passed", `${id} seed ${seed}: ${messages(report)}`);
  }
  const variants = [
    ["kv.band-hero", { tile: 0.7, field: "sky", subject: 5 }, {}],
    ["kv.band-hero", { tile: 1.1 }, { title_1: "研究回测", title_2: "实盘一体", cta_1: "开始", cta_2: "方法 →" }],
    ["card.band-features", { field_start: 3, subject_start: 6 }, {}],
    ["banner.band-black-statement", { show_tile: false }, { statement: "把每一次回测都写成一份别人能复查的记录。" }],
    ["banner.band-black-statement", { show_tile: true, field: "sage", subject: 4 }, { statement: "短句。" }],
    ["cover.band-article", { field: "sand", subject: 6 }, { title: "短标题", deck: "一句话。" }],
    ["card.band-social", { field: "lilac", subject: 3 }, { title: "一行标题" }],
  ];
  for (const [id, params, set] of variants) {
    const report = bank.check(bank.render(id, { params, set }).svg);
    assert.equal(report.status, "passed", `${id} ${JSON.stringify(params)}: ${messages(report)}`);
  }
  assert.ok(Date.now() - started < 45000, `static runs took ${Date.now() - started} ms`);
});

test("the field is never the picture's own accent, and subject and field are parameters", () => {
  const onSky = bank.render("kv.band-hero", { params: { subject: 1, field: "sky" } }).svg;
  assert.equal((onSky.match(/data-role="sky"/g) || []).length, 1, "only the field is sky");
  const a = bank.render("kv.band-hero", { params: { subject: 2 } }).svg;
  assert.notEqual(a, bank.render("kv.band-hero", { params: { subject: 3 } }).svg);
  assert.notEqual(a, bank.render("kv.band-hero", { params: { subject: 2, field: "blush" } }).svg);
  assert.equal(a, bank.render("kv.band-hero", { params: { subject: 2 } }).svg);
  assert.match(a, /<filter id="band-line"[^>]*>(?=.*<feDisplacementMap)(?=.*<feComposite in="d" in2="m" operator="in"\/>)/);
  assert.doesNotMatch(a, /<text[^>]*filter=/);
  assert.throws(() => bank.render("kv.band-hero", { params: { subject: 8 } }), (error) => error.code === "OPTION_VALUE_INVALID");
  assert.throws(() => bank.render("kv.band-hero", { params: { field: "red" } }), (error) => error.code === "OPTION_VALUE_INVALID");
  // the black band's tile is optional, and the buttons follow the statement's last line
  const off = bank.render("banner.band-black-statement", { params: { show_tile: false } }).svg;
  assert.doesNotMatch(off, /id="band-line"/);
  const y = (svg) => Number(/<rect x="120\.0" y="([\d.]+)"[^>]*data-role="ivory"/.exec(svg)[1]);
  assert.ok(y(bank.render("banner.band-black-statement", { set: { statement: "短句。" } }).svg) < y(bank.render("banner.band-black-statement").svg));
});

test("copy that does not fit fails with a fix", () => {
  const long = bank.check(bank.render("kv.band-hero", { set: { title_1: "这是一个长得放不下的标题行它会超出预算并且溢出" } }).svg);
  assert.ok(long.findings.some((f) => (f.rule === "text-overflow" || f.rule === "text-length") && f.slot === "title_1" && f.fix.length > 20), messages(long));
  const card = bank.check(bank.render("card.band-features", { set: { text_2: "这是很长的卡片正文。".repeat(10) } }).svg);
  assert.ok(card.findings.some((f) => f.slot === "text_2"), messages(card));
});

test("every brand-band default render passes the browser check too (one Chrome)", { skip: SKIP, timeout: 600000 }, async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "brand-band-browser-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const jobs = IDS.map((id) => ({ id })).concat([{ id: "kv.band-hero", params: { subject: 6, field: "blush" } }, { id: "card.band-social", params: { subject: 4, field: "sky" } }]);
  for (const result of await checkRenders(BROWSER, jobs, root)) assert.deepEqual(result.findings, [], result.name);
});

test("the HTML product-site kit is one self-contained page with a README, the band rhythm, the library's own pictures and motion that settles", () => {
  const html = fs.readFileSync(path.join(KIT, "index.html"), "utf8");
  assert.ok(fs.existsSync(path.join(KIT, "README.md")));
  assert.match(fs.readFileSync(path.join(KIT, "README.md"), "utf8"), /brand-band/);
  assert.doesNotMatch(html, /<script[^>]+src=|<img\b|@import|url\((?!#)/i, "no external scripts, images or imports");
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  assert.ok(links.every((tag) => /fonts\.(googleapis|gstatic)\.com/.test(tag)), `only font links: ${links.join(" ")}`);
  assert.doesNotMatch(html, /anthropic|claude|openai|deepmind|gemini/i);
  for (const token of ["#faf9f5", "#f0eee6", "#0d0c0b", "#141413", "Newsreader", "Noto Serif SC", "Hanken Grotesk", "feTurbulence", "id=\"cl\"", "pathLength", "prefers-reduced-motion", "createElementNS"]) assert.ok(html.toLowerCase().includes(token.toLowerCase()), token);
  // each of the eight pictures in the page is the library's own output, so the page and the templates cannot drift apart
  for (const id of ill.IDS) assert.equal(html.split(ill.classBody(id)).length - 1, 1, `${id} appears once, as generated`);
  // the rhythm: ivory hero, oat modules, near-black statement, ivory flow, oat call to action, black footer
  const order = ["class=\"hero ", "class=\"band oat ", "class=\"band night ", "id=\"flow\"", "id=\"start\"", "<footer>"].map((token) => html.indexOf(token));
  assert.ok(order.every((at, i) => at > 0 && (i === 0 || at > order[i - 1])), order.join(","));
  assert.match(html, /\.nav\.dark/);
  assert.doesNotMatch(html, /客户评价|用户评价|%</, "no invented testimonials or metrics");
  const style = bank.loadStyle("brand-band");
  assert.ok(style.examples.renders.some((r) => r.file === "examples/brand-band-site-kit/index.html"));
});

test("the kit page passes the browser half of template check at 1440 and 390 wide, motion settled", { skip: SKIP, timeout: 600000 }, async () => {
  for (const result of await kitChecks()) {
    assert.deepEqual(result.findings, [], `${result.width}x${result.height}`);
    assert.equal(result.status, "passed", `${result.width}x${result.height}`);
  }
});
