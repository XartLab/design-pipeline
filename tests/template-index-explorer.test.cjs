"use strict";

// The index-explorer style pack: the grammar of a public research data explorer, measured on two public
// reference pages (kept private, never shipped). Six templates (hero with a seeded tile grid, a tile map
// with a legend card and a tooltip, a ranking with inline bars, stat tiles, a trend chart, a region
// detail), each rendered from parameters with original copy, and the HTML data-explorer kit that proves
// the grammar. The browser checks share their Chromes (tests/helpers/kit-browser-check.cjs): the two kit
// widths run at once from the first test on, and the default renders share one Chrome.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const bank = require("../skill/tools/template-bank/bank.cjs");
const { locateBrowser, CI_SKIP, launch, checkKit, checkRenders } = require("./helpers/kit-browser-check.cjs");

const REPO = path.join(__dirname, "..");
const CLI = path.join(REPO, "skill", "scripts", "designer-pipeline.cjs");
const KIT = path.join(REPO, "examples", "index-explorer-kit");
const CATALOG = JSON.parse(fs.readFileSync(path.join(REPO, "skill", "references", "fonts", "catalog.json"), "utf8"));
const IDS = ["card.index-ranking", "card.index-region", "card.index-stats", "card.index-tilemap", "card.index-trend", "cover.index-hero"];
// the templates with a heat scale or a direction: they take --param convention (the region detail has neither)
const CN_IDS = IDS.filter((id) => id !== "card.index-region");
const CN_SCALE = ["#F6D4CC", "#EE9E8C", "#E07A63", "#D75A44"];
const luminance = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);

const messages = (report) => JSON.stringify(report.findings.map((f) => `${f.rule}:${f.slot}: ${f.message}`));
function cli(root, ...args) {
  const child = spawnSync(process.execPath, [CLI, ...args, "--root", root, "--json"], { encoding: "utf8", windowsHide: true, timeout: 600000, maxBuffer: 64 << 20 });
  let payload = null;
  try { payload = JSON.parse(child.stdout); } catch { payload = null; }
  return { status: child.status, payload, stderr: child.stderr };
}
const BROWSER = locateBrowser();
const SKIP = BROWSER.skip || CI_SKIP;
// The kit check is the slow part: start both widths as soon as the first test runs so they overlap the
// static tests, and let the kit test await the result.
let kitRun = null;
const kitChecks = () => (kitRun ||= checkKit(BROWSER, path.join(KIT, "index.html"), [1440, 390]));

test("index-explorer names its case and lineage, borrows grammar not assets, names no organisation and resolves its fonts through the catalog", () => {
  if (!SKIP) kitChecks().catch(() => {});
  const style = bank.loadStyle("index-explorer");
  assert.match(style.provenance.borrow, /^Borrow grammar, never assets\./);
  assert.match(style.provenance.lineage, /stay private and are not shipped/);
  assert.ok(style.layout.grammar.length >= 6 && style.motion.grammar.length);
  assert.ok(style.checks.guidance.some((line) => /^64 px distinctiveness \(guidance/.test(line)));
  assert.ok(style.checks.guidance.some((line) => /Tile names stay in the fixed dark ink/.test(line)));
  assert.equal(style.checks.browserOnRender, true);
  for (const recipe of style.materials.recipes) assert.match(recipe, /materials (fetch|cut|process|generate)/);
  const families = new Set(CATALOG.families.map((f) => f.family));
  for (const [role, spec] of Object.entries(style.fonts.roles)) {
    assert.ok(spec.stack.length >= 2 && spec.stack.some((family) => families.has(family)), `${role}: ${spec.stack.join(" > ")}`);
  }
  assert.deepEqual(Object.keys(style.fonts.roles), ["serif", "sans", "mono"]);
  assert.equal(style.palette.ivory.value, "#FAF9F5");
  assert.deepEqual(["s1", "s2", "s3", "s4"].map((role) => style.palette[role].value), ["#BEE5D8", "#89D1B9", "#59B295", "#388F76"]);
  const all = JSON.stringify(style) + IDS.map((id) => JSON.stringify(bank.loadManifest(id)) + fs.readFileSync(path.join(bank.TEMPLATES_ROOT, id, "spec.md"), "utf8") + fs.readFileSync(path.join(bank.TEMPLATES_ROOT, id, "template.svg"), "utf8")).join("");
  assert.doesNotMatch(all, /anthropic|claude|openai|deepmind|google ai|\bmeta ai\b|\bgpt\b|gemini|\bllama\b/i);
  assert.deepEqual(bank.templateIds().filter((id) => bank.loadManifest(id).style === "index-explorer"), IDS);
  const listed = cli(fs.mkdtempSync(path.join(os.tmpdir(), "index-explorer-")), "template", "list", "--style", "index-explorer");
  assert.equal(listed.status, 0, JSON.stringify(listed.payload));
  assert.deepEqual(listed.payload.styles[0].templates, IDS);
});

test("index-explorer templates pass the static check at every size, in both themes, for 50 seeds and in their variants", () => {
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
    ["cover.index-hero", { seed: 9999 }, {}],
    ["cover.index-hero", { seed: 1 }, { title_1: "热点指数", title_2: "一页看全市场", cta_1: "进入", cta_2: "方法" }],
    ["card.index-ranking", { top: 6, spread: 0.9, max: 8 }, {}],
    ["card.index-ranking", { top: 1.5, spread: 0.2, max: 1 }, {}],
    ["card.index-stats", { value_1: 9, value_2: 0.1, delta_3: -60, delta_4: 60 }, {}],
    ["card.index-trend", { active: 3, volatility: 0.4, seed: 77 }, {}],
    ["card.index-trend", { active: 2, volatility: 0.02 }, {}],
    ["card.index-region", { rank: 31, index: 0.1 }, { name: "西藏" }],
    ["card.index-region", { rank: 1, index: 6 }, {}],
  ];
  for (const [id, params, set] of variants) {
    const report = bank.check(bank.render(id, { params, set }).svg);
    assert.equal(report.status, "passed", `${id} ${JSON.stringify(params)}: ${messages(report)}`);
  }
  // convention=cn (red up, green down) is a palette switch on the five templates that carry heat or direction:
  // the same sweep passes, in both themes, at every size
  for (const id of CN_IDS) {
    for (const size of bank.loadManifest(id).sizes) {
      for (const theme of ["light", "dark"]) {
        const report = bank.check(bank.render(id, { size, params: { theme, convention: "cn" } }).svg);
        assert.equal(report.status, "passed", `${id} ${size} ${theme} cn: ${messages(report)}`);
      }
    }
    for (let seed = 1; seed <= 20; seed += 1) {
      const report = bank.check(bank.render(id, { seed, params: { convention: "cn" } }).svg);
      assert.equal(report.status, "passed", `${id} cn seed ${seed}: ${messages(report)}`);
    }
  }
  for (const [id, params] of [["card.index-stats", { value_1: 9, value_2: 0.1, delta_3: -60, delta_4: 60 }], ["card.index-trend", { active: 3, volatility: 0.4, seed: 77 }], ["card.index-ranking", { top: 6, spread: 0.9, max: 8 }], ["cover.index-hero", { seed: 9999 }]]) {
    for (const theme of ["light", "dark"]) {
      const report = bank.check(bank.render(id, { params: { ...params, theme, convention: "cn" } }).svg);
      assert.equal(report.status, "passed", `${id} cn ${theme} ${JSON.stringify(params)}: ${messages(report)}`);
    }
  }
  for (let focus = 0; focus <= 30; focus += 1) {
    const report = bank.check(bank.render("card.index-tilemap", { params: { focus, seed: 100 + focus, convention: "cn" } }).svg);
    assert.equal(report.status, "passed", `tilemap cn focus ${focus}: ${messages(report)}`);
  }
  // every focus tile of the map: the tooltip sits in the grid's empty corner, so no focus covers a name
  for (let focus = 0; focus <= 30; focus += 1) {
    const report = bank.check(bank.render("card.index-tilemap", { params: { focus, seed: 100 + focus } }).svg);
    assert.equal(report.status, "passed", `tilemap focus ${focus}: ${messages(report)}`);
  }
});

test("the tile grid has 31 units on four classes by rank, seeded: same seed, same render; another seed, another map", () => {
  const svg = bank.render("card.index-tilemap", { params: { seed: 7 } }).svg;
  assert.equal(svg, bank.render("card.index-tilemap", { params: { seed: 7 } }).svg);
  assert.notEqual(svg, bank.render("card.index-tilemap", { params: { seed: 8 } }).svg);
  const count = (role) => (svg.match(new RegExp(`<rect [^>]*data-role="${role}"/>`, "g")) || []).length;
  assert.deepEqual(["s4", "s3", "s2", "s1"].map(count), [8, 8, 8, 7]);
  const unit = svg.match(/<g data-chk="marks-sans-tileink-\d+">(.*?)<\/g>/)[1];
  assert.equal((unit.match(/<text /g) || []).length, 31, "one short name on each of the 31 tiles, in one measured unit");
  // the tooltip's numbers come from the focus tile: the same unit with another focus reads another name
  assert.match(svg, /data-slot="tip_name"[^>]*>广东</);
  assert.match(bank.render("card.index-tilemap", { params: { focus: 0 } }).svg, /data-slot="tip_name"[^>]*>黑龙江</);
  assert.throws(() => bank.render("card.index-tilemap", { set: { tip_v1: "9.99×" } }), (error) => error.code === "OPTION_VALUE_INVALID" && /derived/.test(error.message));
  assert.throws(() => bank.render("card.index-tilemap", { params: { focus: 31 } }), (error) => error.code === "OPTION_VALUE_INVALID");
});

test("a bar and its value come from one number: ranking rows are descending, stat tiles follow their sign, the region's strip marks its rank", () => {
  const ranking = bank.render("card.index-ranking", { params: { top: 4, spread: 0.5, max: 4 } }).svg;
  const values = [...ranking.matchAll(/data-slot="value_(\d+)"[^>]*>([\d.]+)</g)].map((m) => Number(m[2]));
  assert.equal(values.length, 10);
  assert.deepEqual(values, [...values].sort((a, b) => b - a));
  const bars = [...ranking.matchAll(/<rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="20\.0" fill="#[0-9A-F]{6}" data-role="s[1-4]"\/>/g)].map((m) => Number(m[1]));
  assert.equal(bars.length, 10);
  bars.forEach((w, i) => assert.ok(Math.abs(w - Math.min(1, values[i] / 4) * 188) < 0.7, `bar ${i + 1}: ${w} vs ${values[i]}`));
  assert.throws(() => bank.render("card.index-ranking", { set: { value_2: "9.99" } }), (error) => error.code === "OPTION_VALUE_INVALID" && /derived/.test(error.message));
  const stats = bank.render("card.index-stats", { params: { delta_1: 5, delta_2: -5 } }).svg;
  assert.match(stats, /data-slot="delta_1"[^>]*>\+5\.0%</);
  assert.match(stats, /data-slot="delta_2"[^>]*>−5\.0%</);
  assert.match(stats, /data-slot="value_3"[^>]*>0\.84×</);
  const triangles = [...stats.matchAll(/<polygon points="[^"]+" fill="(#[0-9A-F]{6})" data-role="(s4|coral)"\/>/g)].map((m) => m[2]);
  assert.deepEqual(triangles.slice(0, 2), ["s4", "coral"]);
  const region = bank.render("card.index-region", { params: { rank: 5, index: 2.5 } }).svg;
  assert.match(region, /data-slot="rank_value"[^>]*>5 \/ 31</);
  assert.match(region, /data-slot="index_value"[^>]*>2\.50 ×</);
  const cells = [...region.matchAll(/<rect x="[\d.]+" y="208\.0" width="14\.0" height="36\.0" fill="#[0-9A-F]{6}" data-role="(blue|mist)"\/>/g)].map((m) => m[1]);
  assert.equal(cells.length, 31);
  assert.equal(cells.indexOf("blue"), 4);
  assert.throws(() => bank.render("card.index-region", { params: { rank: 32 } }), (error) => error.code === "OPTION_VALUE_INVALID");
});

test("convention=cn turns heat to reds and a rise to red: red up, green down; intl, the default, is the measured green", () => {
  for (const id of CN_IDS) {
    assert.deepEqual(bank.loadManifest(id).params.convention.values, ["intl", "cn"], id);
    assert.equal(bank.loadManifest(id).params.convention.default, "intl", id);
    assert.equal(bank.render(id).svg, bank.render(id, { params: { convention: "intl" } }).svg, `${id}: intl is the default render, unchanged`);
    assert.notEqual(bank.render(id).svg, bank.render(id, { params: { convention: "cn" } }).svg, `${id}: cn changes the render`);
    assert.throws(() => bank.render(id, { params: { convention: "us" } }), (error) => error.code === "OPTION_VALUE_INVALID");
  }
  assert.throws(() => bank.render("card.index-region", { params: { convention: "cn" } }), (error) => error.code === "OPTION_VALUE_INVALID", "the region detail has no heat or direction, so no convention");
  // the map: the same four classes of 8, 8, 8 and 7, in the reds, none of the greens left
  const map = bank.render("card.index-tilemap", { params: { seed: 7, convention: "cn" } }).svg;
  const fill = (svg, role) => new Set([...svg.matchAll(new RegExp(`fill="(#[0-9A-F]{6})" data-role="${role}"`, "g"))].map((m) => m[1]));
  CN_SCALE.forEach((hex, i) => assert.deepEqual([...fill(map, `s${i + 1}`)], [hex], `s${i + 1}`));
  assert.doesNotMatch(map, /#59B295|#89D1B9|#BEE5D8/, "no green steps left");
  const count = (role) => (map.match(new RegExp(`<rect [^>]*data-role="${role}"/>`, "g")) || []).length;
  assert.deepEqual(["s4", "s3", "s2", "s1"].map(count), [8, 8, 8, 7]);
  // the scale reads dark to light and the fixed tile ink holds on every step, deepest included
  const lums = CN_SCALE.map(luminance);
  assert.deepEqual([...lums].sort((a, b) => b - a), lums, "light to deep");
  for (const hex of CN_SCALE) assert.ok(contrast(hex, "#141413") >= 4.5, `${hex} with the tile ink`);
  // stat tiles: a rise is a red up triangle, a fall a green down triangle, and the sparkline follows the sign
  const stats = bank.render("card.index-stats", { params: { delta_1: 5, delta_2: -5, convention: "cn" } }).svg;
  const tri = [...stats.matchAll(/<polygon points="([^"]+)" fill="(#[0-9A-F]{6})" data-role="(s4|coral)"\/>/g)].slice(0, 2);
  assert.deepEqual(tri.map((m) => [m[2], m[3]]), [["#D75A44", "s4"], ["#388F76", "coral"]]);
  const dots = [...stats.matchAll(/<circle [^>]*r="[\d.]+" fill="(#[0-9A-F]{6})"\/><\/g>/g)].map((m) => m[1]);
  assert.deepEqual(dots.slice(0, 2), ["#D75A44", "#388F76"], "the end dot takes the direction's colour");
  const intl = bank.render("card.index-stats", { params: { delta_1: 5, delta_2: -5 } }).svg;
  assert.deepEqual([...intl.matchAll(/<polygon points="[^"]+" fill="(#[0-9A-F]{6})" data-role="(?:s4|coral)"\/>/g)].slice(0, 2).map((m) => m[1]), ["#388F76", "#E6796D"], "intl: rising green, falling coral");
  // ranking bars use the reds; the dark theme keeps them
  assert.deepEqual([...fill(bank.render("card.index-ranking", { params: { convention: "cn", theme: "dark" } }).svg, "s4")], ["#D75A44"]);
});

test("copy that does not fit fails with a fix", () => {
  const long = bank.check(bank.render("cover.index-hero", { set: { title_2: "这是一个长得放不下的标题行它会超出预算并且溢出" } }).svg);
  assert.ok(long.findings.some((f) => (f.rule === "text-overflow" || f.rule === "text-length") && f.slot === "title_2" && f.fix.length > 20), messages(long));
  const row = bank.check(bank.render("card.index-ranking", { set: { name_3: "这是一个很长的板块名称放不下" } }).svg);
  assert.ok(row.findings.some((f) => f.slot === "name_3"), messages(row));
});

test("every index-explorer default render passes the browser check too, and the map in both themes and in the cn convention, the only text on a scale colour (two Chromes)", { skip: SKIP, timeout: 600000 }, async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "index-explorer-browser-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const jobs = IDS.map((id) => ({ id })).concat([{ id: "card.index-tilemap", params: { theme: "dark" } }, { id: "card.index-tilemap", params: { convention: "cn" } }, { id: "card.index-tilemap", params: { convention: "cn", theme: "dark" } }]);
  // two Chromes at once: a check costs about a third of a second per text unit
  const halves = [jobs.filter((_, i) => i % 2 === 0), jobs.filter((_, i) => i % 2 === 1)];
  const results = await Promise.all(halves.map((half, i) => { const dir = path.join(root, String(i)); fs.mkdirSync(dir); return checkRenders(BROWSER, half, dir); }));
  for (const result of results.flat()) assert.deepEqual(result.findings, [], result.name);
});

test("the HTML data-explorer kit is one self-contained page with a README, a CSV box and no organisation's marks", () => {
  const html = fs.readFileSync(path.join(KIT, "index.html"), "utf8");
  assert.ok(fs.existsSync(path.join(KIT, "README.md")));
  assert.match(fs.readFileSync(path.join(KIT, "README.md"), "utf8"), /index-explorer/);
  assert.doesNotMatch(html, /<script[^>]+src=|<img\b|@import|url\((?!#)/i, "no external scripts, images or imports");
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  assert.ok(links.every((tag) => /fonts\.(googleapis|gstatic)\.com/.test(tag)), `only font links: ${links.join(" ")}`);
  assert.doesNotMatch(html, /anthropic|claude|openai|deepmind|gemini/i);
  for (const token of ["data-conv", "idx-conv", "localStorage", "红涨绿跌", "绿涨红跌", "#f6d4cc", "#d75a44", "#faf9f5", "#141413", "#388f76", "#bee5d8", "Source Serif 4", "JetBrains Mono", "Noto Serif SC", "<details", "<textarea", "aria-sort", "示例数据", "prefers-reduced-motion"]) assert.ok(html.toLowerCase().includes(token.toLowerCase()), token);
  const style = bank.loadStyle("index-explorer");
  assert.ok(style.examples.renders.some((r) => r.file === "examples/index-explorer-kit/index.html"));
});

test("the kit page passes the browser half of template check at 1440 and 390 wide, motion settled", { skip: SKIP, timeout: 600000 }, async () => {
  for (const result of await kitChecks()) {
    assert.deepEqual(result.findings, [], `${result.width}x${result.height}`);
    assert.equal(result.status, "passed", `${result.width}x${result.height}`);
  }
});

test("the kit defaults to 红涨绿跌 and its toggle recolours the map, legend, bars and triangles live, and is remembered", { skip: SKIP, timeout: 120000 }, async () => {
  const browser = await launch(BROWSER, path.join(KIT, "index.html"));
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`file://${path.join(KIT, "index.html")}`, { waitUntil: "load" });
    await page.evaluate(() => { try { localStorage.removeItem("idx-conv"); } catch { /* none */ } });
    await page.reload({ waitUntil: "load" });
    const read = () => page.evaluate(() => {
      const bg = (el) => getComputedStyle(el).backgroundColor;
      const tri = document.querySelector(".stat .d i.up");
      return {
        conv: document.documentElement.dataset.conv,
        pressed: [...document.querySelectorAll(".seg button")].map((b) => b.getAttribute("aria-pressed")),
        tiles: [...new Set([...document.querySelectorAll(".tile")].map(bg))],
        legend: [...document.querySelectorAll("#legend i")].map(bg),
        bars: [...new Set([...document.querySelectorAll(".inb b")].map(bg))],
        up: tri ? getComputedStyle(tri).borderBottomColor : null,
        dn: getComputedStyle(document.querySelector(".chg i.dn") || document.body).borderTopColor,
      };
    });
    const rgb = (hex) => `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ")})`;
    const cn = await read();
    assert.equal(cn.conv, "cn");
    assert.deepEqual(cn.pressed, ["true", "false"]);
    assert.deepEqual([...cn.tiles].sort(), CN_SCALE.map(rgb).sort(), "the map is on the four reds");
    assert.deepEqual(cn.legend, ["#D75A44", "#E07A63", "#EE9E8C", "#F6D4CC"].map(rgb), "the legend reads leading to emerging");
    assert.ok(cn.bars.every((c) => CN_SCALE.map(rgb).includes(c)), `bars: ${cn.bars}`);
    assert.equal(cn.up, rgb("#D75A44"), "a rise is a red triangle");
    assert.equal(cn.dn, rgb("#388F76"), "a fall is a green triangle");
    await page.click('.seg button[data-conv="intl"]');
    const intl = await read();
    assert.equal(intl.conv, "intl");
    assert.deepEqual(intl.pressed, ["false", "true"]);
    assert.deepEqual([...intl.tiles].sort(), ["#388F76", "#59B295", "#89D1B9", "#BEE5D8"].map(rgb).sort(), "the map is back on the greens");
    assert.equal(intl.up, rgb("#388F76"), "intl: a rise is green");
    assert.equal(intl.dn, rgb("#E6796D"), "intl: a fall is coral");
    await page.reload({ waitUntil: "load" });
    assert.equal((await read()).conv, "intl", "the choice is remembered");
    await page.click('.seg button[data-conv="cn"]');
    await page.reload({ waitUntil: "load" });
    assert.equal((await read()).conv, "cn");
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
