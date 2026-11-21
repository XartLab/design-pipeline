"use strict";

// Layouts of the index-explorer style pack (styles/index-explorer/style.json): the grammar of a public
// research data explorer, measured in Chrome on two public reference pages the owner named (kept private,
// never shipped). An ivory page, one sequential green scale for a tile-grid map, pastel categorical tiles,
// white legend cards with a 16 radius, hairline-ruled ranking rows with a mono number, inline bars and a mono
// value, serif display numerals, underlined tabs, a dark tooltip. Geometry in a 1600-unit canvas scaled to
// the size. The map is a generic tile grid of 31 units (never a geographic file). Everything is drawn here;
// the faces are named (Source Serif 4, Inter, JetBrains Mono, Noto), never bundled.

const { f1, esc } = require("./layout-kit.cjs");
const measure = require("./measure.cjs");

// The dark theme: ground #141413, light ink, panels one step up. Tile ink and the tooltip stay fixed.
const DARK = { ivory: "#141413", ink: "#F0EEE6", mute: "#A8A69C", hair: "#34332F", panel: "#1F1E1C", card: "#1F1E1C", cardline: "#3D3D3A", mist: "#3A4A45" };
const SCALE = ["s1", "s2", "s3", "s4"]; // emerging, lower middle, upper middle, leading
const CATS = ["lime", "rose", "salmon", "blue", "sand", "olive", "peri", "mist"]; // pastel categorical tiles

// 31 tile-grid units: [short name, full name, column, row]. A generic grid, not a map file.
const PROV = [
  ["黑", "黑龙江", 7, 0],
  ["蒙", "内蒙古", 4, 1], ["京", "北京", 5, 1], ["津", "天津", 6, 1], ["吉", "吉林", 7, 1],
  ["新", "新疆", 0, 2], ["甘", "甘肃", 2, 2], ["宁", "宁夏", 3, 2], ["晋", "山西", 4, 2], ["冀", "河北", 5, 2], ["鲁", "山东", 6, 2], ["辽", "辽宁", 7, 2],
  ["藏", "西藏", 0, 3], ["青", "青海", 1, 3], ["陕", "陕西", 3, 3], ["豫", "河南", 4, 3], ["皖", "安徽", 5, 3], ["苏", "江苏", 6, 3], ["沪", "上海", 7, 3],
  ["川", "四川", 2, 4], ["渝", "重庆", 3, 4], ["鄂", "湖北", 4, 4], ["赣", "江西", 5, 4], ["浙", "浙江", 6, 4],
  ["滇", "云南", 2, 5], ["黔", "贵州", 3, 5], ["湘", "湖南", 4, 5], ["闽", "福建", 5, 5],
  ["桂", "广西", 3, 6], ["粤", "广东", 4, 6],
  ["琼", "海南", 4, 7],
];
const BIAS = { 粤: 0.9, 京: 1.0, 沪: 1.0, 浙: 0.7, 苏: 0.6, 鲁: 0.2, 川: 0.3, 鄂: 0.15 };

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seeded index values (1.0 = as expected), skewed so a few units lead; classes by rank quartile.
function heat(seed) {
  const rnd = mulberry(Math.round(seed) * 7919 + 13);
  const vals = PROV.map(([short]) => Math.max(0.12, 0.22 + 3.1 * Math.pow(rnd(), 2.1) + (BIAS[short] || 0)));
  const order = vals.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).map(([, i]) => i);
  const rank = new Array(vals.length); const cls = new Array(vals.length);
  order.forEach((i, k) => { rank[i] = k + 1; cls[i] = k < 8 ? 3 : k < 16 ? 2 : k < 24 ? 1 : 0; });
  return { vals, rank, cls, sum: vals.reduce((a, b) => a + b, 0) };
}

const monoW = (text, size) => [...String(text)].length * 0.62 * size;
const tw = (text, size, weight = 400, serif = false) => measure.textWidth(text, size, 0, { serif, weight });
// The slot's text box for the static check: the extent is [x0, baseline - 0.88 size] over size x lines.
function tbox(x, y, size, w, { lines = 1, lh = 1.3, anchor = "start" } = {}) {
  const x0 = anchor === "start" ? x : anchor === "middle" ? x - w / 2 : x - w;
  return [x0 - 2, y - 0.88 * size - 2, w + 4, size * (1 + (lines - 1) * lh) + 4];
}

function begin(d) {
  if (d.p.theme === "dark") Object.assign(d.pal, DARK);
  d.rect(0, 0, d.W, d.H, "ivory");
}

// Several short texts of one style as one measured unit: each is a <text> inside a <g data-chk>, so the
// browser check measures one unit instead of one per tile or tick (a unit owns its descendants).
function marks(d, items, size, { role = "mute", family = "sans", weight = null, anchor = "start" } = {}) {
  const w = weight || d.roles[family].weight;
  d.markId = (d.markId || 0) + 1; // per render, so one render is byte-stable
  const texts = items.map(([x, y, t]) => `<text x="${f1(x)}" y="${f1(y)}" font-family="${esc(d.families[family])}" font-weight="${w}" font-size="${f1(size)}" fill="${d.pal[role]}" data-role="${role}" data-font-role="${family}" text-anchor="${anchor}">${esc(t)}</text>`).join("");
  d.raw(`<g data-chk="marks-${family}-${role}-${d.markId}">${texts}</g>`);
}

function card(d, x, y, w, h, s, r = 16) {
  d.raw(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(r * s)}" fill="${d.pal.card}" stroke="${d.pal.cardline}" stroke-width="1" data-role="card"/>`);
}

// Pill button: 1 px hairline, full radius, sans 500; width follows the label.
function pill(d, name, x, y, s, { h = 48, size = 17, minW = 128 } = {}) {
  const { text } = d.value(name);
  const fs = size * s; const hh = h * s;
  const w = Math.max(minW * s, tw(text, fs, 500) + 52 * s);
  d.raw(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(hh)}" rx="${f1(hh / 2)}" fill="${d.pal.ivory}" stroke="${d.pal.cardline}" stroke-width="1" data-role="ivory"/>`);
  d.text(name, x + w / 2, y + hh / 2 + 0.36 * fs, fs, { role: "ink", family: "sans", weight: 500, anchor: "middle", box: [x + 8 * s, y + 4 * s, w - 16 * s, hh - 8 * s] });
  return w;
}

// The tile grid: 8 x 8 cells, a tile for each of the 31 units, coloured by class. Returns tile origins.
function tiles(d, x0, y0, pitch, gap, data, { names = true, nameSize = 0, focus = -1, s = 1 } = {}) {
  const t = pitch - gap; let out = ""; const names_ = [];
  const at = [];
  PROV.forEach(([short, , c, r], i) => {
    const x = x0 + c * pitch; const y = y0 + r * pitch;
    at.push([x, y]);
    const role = SCALE[data.cls[i]];
    out += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(t)}" height="${f1(t)}" fill="${d.pal[role]}" data-role="${role}"/>`;
    if (names) names_.push([x + t / 2, y + t / 2 + 0.36 * nameSize, short, c, r]);
  });
  d.raw(out);
  if (names) {
    const opts = { role: "tileink", weight: 500, anchor: "middle" };
    if (d.p.theme !== "dark") marks(d, names_.map((n) => n.slice(0, 3)), nameSize, opts);
    else {
      // the fixed dark ink sits on the dark page between tiles: one unit per run of touching tiles in a row,
      // so the check measures the tile under each name and not the gaps and empty cells around it
      const runs = []; let last = null;
      for (const n of names_.slice().sort((a, b) => a[4] - b[4] || a[3] - b[3])) {
        if (last && last[4] === n[4] && last[3] + 1 === n[3]) runs[runs.length - 1].push(n); else runs.push([n]);
        last = n;
      }
      for (const run of runs) marks(d, run.map((n) => n.slice(0, 3)), nameSize, opts);
    }
  }
  if (focus >= 0) {
    const [x, y] = at[focus];
    d.raw(`<rect data-deco="1" x="${f1(x - 1 * s)}" y="${f1(y - 1 * s)}" width="${f1(t + 2 * s)}" height="${f1(t + 2 * s)}" fill="none" stroke="${d.pal.ink}" stroke-width="${f1(2.5 * s)}"/>`);
  }
  return at;
}

// A squarified treemap of `values` in [x, y, w, h]; returns one rect per value in the input order.
function treemap(values, x, y, w, h) {
  const total = values.reduce((a, b) => a + b, 0);
  const items = values.map((v, i) => ({ i, a: (v / total) * w * h })).sort((a, b) => b.a - a.a);
  const out = new Array(values.length);
  let [rx, ry, rw, rh] = [x, y, w, h];
  const worst = (row, side) => { const sum = row.reduce((a, b) => a + b.a, 0); const max = Math.max(...row.map((r) => r.a)); const min = Math.min(...row.map((r) => r.a)); return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min)); };
  let k = 0;
  while (k < items.length) {
    const side = Math.min(rw, rh); const row = [items[k]]; k += 1;
    while (k < items.length && worst([...row, items[k]], side) <= worst(row, side)) { row.push(items[k]); k += 1; }
    const sum = row.reduce((a, b) => a + b.a, 0);
    if (rw >= rh) { // a column on the left
      const cw = sum / rh; let cy = ry;
      row.forEach((r) => { const ch = r.a / cw; out[r.i] = [rx, cy, cw, ch]; cy += ch; });
      rx += cw; rw -= cw;
    } else { // a row on top
      const chh = sum / rw; let cx = rx;
      row.forEach((r) => { const cw2 = r.a / chh; out[r.i] = [cx, ry, cw2, chh]; cx += cw2; });
      ry += chh; rh -= chh;
    }
  }
  return out;
}

const LAYOUTS = {
  // ---- hero: serif title left, a seeded tile grid right: 1600 x 900 ----------------------------------
  "cover.index-hero"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s;
    // the mark: a small graph-paper square with four green dots (a drawn mark, not a logo)
    const mx = L; const my = 96 * s; const ms = 56 * s;
    let grid = ""; for (let i = 0; i <= 5; i += 1) grid += `<rect x="${f1(mx + (i * ms) / 5)}" y="${f1(my)}" width="1" height="${f1(ms)}" fill="${d.pal.cardline}"/><rect x="${f1(mx)}" y="${f1(my + (i * ms) / 5)}" width="${f1(ms)}" height="1" fill="${d.pal.cardline}"/>`;
    const dots = [[0.1, 0.9], [0.32, 0.64], [0.55, 0.78], [0.74, 0.42], [0.92, 0.12]].map(([a, b]) => `<circle cx="${f1(mx + a * ms)}" cy="${f1(my + b * ms)}" r="${f1(4.6 * s)}" fill="${d.pal.s4}"/>`).join("");
    d.raw(`<g data-deco="1">${grid}${dots}</g>`);
    d.text("title_1", L, 322 * s, 80 * s, { role: "ink", family: "serif", weight: 400, box: tbox(L, 322 * s, 80 * s, 800 * s) });
    d.text("title_2", L, 414 * s, 80 * s, { role: "ink", family: "serif", weight: 300, box: tbox(L, 414 * s, 80 * s, 800 * s) });
    d.text("meta", L, 470 * s, 14 * s, { role: "mute", family: "mono", weight: 400, tracking: 40, box: tbox(L, 470 * s, 14 * s, 620 * s) });
    d.text("deck", L, 534 * s, 20 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.5, box: tbox(L, 534 * s, 20 * s, 600 * s, { lines: 2, lh: 1.5 }) });
    const w1 = pill(d, "cta_1", L, 640 * s, s);
    pill(d, "cta_2", L + w1 + 12 * s, 640 * s, s);
    const data = heat(p.seed); const pitch = 76 * s; const x0 = 1504 * s - 8 * pitch + 6 * s; const y0 = (H - 8 * pitch + 6 * s) / 2;
    tiles(d, x0, y0, pitch, 6 * s, data, { names: false, s });
    d.zone("copy", "safe", [0, 0, 880 * s, H], { slots: ["title_1", "title_2", "meta", "deck", "cta_1", "cta_2"] });
  },

  // ---- tile map: legend card left, tile grid with a pinned tooltip right: 1600 x 900 -----------------
  "card.index-tilemap"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s;
    d.text("title", L, 150 * s, 56 * s, { role: "ink", family: "serif", weight: 400, box: tbox(L, 150 * s, 56 * s, 420 * s) });
    d.text("lede", L, 206 * s, 18 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.55, box: tbox(L, 206 * s, 18 * s, 400 * s, { lines: 3, lh: 1.55 }) });
    // the legend card: white, 1 hairline, radius 16, a bold title, a description, four class dots
    const cx = L; const cy = 330 * s; const cw = 400 * s; const ch = 310 * s; const pad = 24 * s;
    card(d, cx, cy, cw, ch, s);
    d.text("legend_title", cx + pad, cy + pad + 16 * s, 17 * s, { role: "ink", family: "sans", weight: 600, box: tbox(cx + pad, cy + pad + 16 * s, 17 * s, cw - 2 * pad) });
    d.text("legend_desc", cx + pad, cy + pad + 52 * s, 15 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.5, box: tbox(cx + pad, cy + pad + 52 * s, 15 * s, cw - 2 * pad, { lines: 3, lh: 1.5 }) });
    [3, 2, 1, 0].forEach((c, k) => {
      const y = cy + 176 * s + k * 30 * s;
      d.raw(`<circle cx="${f1(cx + pad + 7 * s)}" cy="${f1(y - 5 * s)}" r="${f1(7 * s)}" fill="${d.pal[SCALE[c]]}" data-role="${SCALE[c]}"/>`);
      d.text(`legend_${k + 1}`, cx + pad + 24 * s, y, 15 * s, { role: "ink", family: "sans", weight: 400, box: tbox(cx + pad + 24 * s, y, 15 * s, cw - 2 * pad - 24 * s) });
    });
    // the map panel
    const px = 560 * s; const py = 80 * s; const pw = 944 * s; const ph = 720 * s;
    d.raw(`<rect x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}" rx="${f1(8 * s)}" fill="${d.pal.panel}" data-role="panel"/>`);
    const pitch = 74 * s; const gap = 4 * s; const gw = 8 * pitch - gap;
    const x0 = px + (pw - gw) / 2; const y0 = py + 44 * s;
    const data = heat(p.seed); const focus = Math.round(p.focus);
    const at = tiles(d, x0, y0, pitch, gap, data, { names: true, nameSize: 30 * s, focus, s });
    d.text("hint", px + pw / 2, y0 + gw + 50 * s, 15 * s, { role: "mute", family: "sans", weight: 400, anchor: "middle", box: tbox(px + pw / 2, y0 + gw + 50 * s, 15 * s, 700 * s, { anchor: "middle" }) });
    // the pinned tooltip: dark, radius 8, a serif name, a hairline, the class, two rows (it sits in the grid's empty corner)
    const tx = x0; const ty = y0; const tW = 4 * pitch - gap; const tH = 2 * pitch - gap;
    d.raw(`<rect x="${f1(tx)}" y="${f1(ty)}" width="${f1(tW)}" height="${f1(tH)}" rx="${f1(8 * s)}" fill="${d.pal.tip}" data-role="tip"/>`);
    const tp = 16 * s;
    d.text("tip_name", tx + tp, ty + 36 * s, 20 * s, { role: "tiptext", family: "serif", weight: 400, content: PROV[focus][1], box: tbox(tx + tp, ty + 36 * s, 20 * s, tW - 2 * tp) });
    d.raw(`<rect x="${f1(tx + tp)}" y="${f1(ty + 50 * s)}" width="${f1(tW - 2 * tp)}" height="1" fill="${d.pal.tipline}" data-role="tipline"/>`);
    d.raw(`<circle cx="${f1(tx + tp + 5 * s)}" cy="${f1(ty + 68 * s)}" r="${f1(5 * s)}" fill="${d.pal[SCALE[data.cls[focus]]]}" data-role="${SCALE[data.cls[focus]]}"/>`);
    const clsText = d.value(`legend_${4 - data.cls[focus]}`).text;
    d.text("tip_class", tx + tp + 18 * s, ty + 73 * s, 14 * s, { role: "tiptext", family: "sans", weight: 400, content: clsText, box: tbox(tx + tp + 18 * s, ty + 73 * s, 14 * s, tW - 2 * tp - 18 * s) });
    const v = data.vals[focus];
    [["tip_l1", "tip_v1", `${v.toFixed(2)}×`, 100 * s], ["tip_l2", "tip_v2", `${((v / data.sum) * 100).toFixed(1)}%`, 124 * s]].forEach(([l, val, text, off]) => {
      d.text(l, tx + tp, ty + off, 13 * s, { role: "tiptext", family: "sans", weight: 500, box: tbox(tx + tp, ty + off, 13 * s, 140 * s) });
      d.text(val, tx + tW - tp, ty + off, 13 * s, { role: "tiptext", family: "sans", weight: 400, anchor: "end", content: text, box: tbox(tx + tW - tp, ty + off, 13 * s, 90 * s, { anchor: "end" }) });
    });
    d.zone("map", "safe", [px, py, pw, ph], { slots: ["hint", "tip_name", "tip_class", "tip_l1", "tip_v1", "tip_l2", "tip_v2"] });
    void at;
  },

  // ---- ranking: two columns of hairline rows with a mono number, an inline bar and a mono value ------
  "card.index-ranking"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s;
    d.text("title", L, 150 * s, 48 * s, { role: "ink", family: "serif", weight: 400, box: tbox(L, 150 * s, 48 * s, 1000 * s) });
    d.text("lede", L, 206 * s, 18 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.55, box: tbox(L, 206 * s, 18 * s, 900 * s, { lines: 2, lh: 1.55 }) });
    // seeded, descending values: a top value and a spread, jittered, sorted
    const rnd = mulberry(Math.round(p.seed) * 104729 + 7);
    const vals = Array.from({ length: 10 }, (_, i) => Math.max(0.2, p.top * (1 - p.spread * Math.pow(i / 9, 0.85)) * (0.96 + rnd() * 0.08))).sort((a, b) => b - a);
    const colW = 640 * s; const rowH = 70 * s; const y0 = 330 * s; const gutter = 128 * s;
    d.text("group_title", L, y0 - 22 * s, 15 * s, { role: "ink", family: "sans", weight: 600, box: tbox(L, y0 - 22 * s, 15 * s, 600 * s) });
    d.text("group_title_2", L + colW + gutter, y0 - 22 * s, 15 * s, { role: "ink", family: "sans", weight: 600, box: tbox(L + colW + gutter, y0 - 22 * s, 15 * s, 600 * s) });
    const bars = []; const nums = [];
    vals.forEach((v, i) => {
      const col = i < 5 ? 0 : 1; const row = i % 5;
      const cx = L + col * (colW + gutter); const y = y0 + row * rowH;
      d.rect(cx, y + rowH - 1, colW, 1, "hair");
      nums.push([cx, y + 42 * s, String(i + 1).padStart(2, "0")]);
      d.text(`name_${i + 1}`, cx + 52 * s, y + 42 * s, 21 * s, { role: "ink", family: "sans", weight: 400, box: tbox(cx + 52 * s, y + 42 * s, 21 * s, 250 * s) });
      const bx = cx + 330 * s; const bw = 190 * s; const bh = 22 * s; const by = y + (rowH - bh) / 2 - 1 * s;
      const cls = SCALE[[3, 3, 3, 2, 2, 1, 1, 1, 0, 0][i]];
      d.raw(`<rect x="${f1(bx)}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bh)}" fill="${d.pal.ivory}" stroke="${d.pal.ink}" stroke-width="1" data-role="ivory"/>`);
      bars.push(`<rect x="${f1(bx + 1)}" y="${f1(by + 1)}" width="${f1(Math.max(0, Math.min(1, v / p.max)) * (bw - 2))}" height="${f1(bh - 2)}" fill="${d.pal[cls]}" data-role="${cls}"/>`);
      d.text(`value_${i + 1}`, cx + colW, y + 42 * s, 21 * s, { role: "ink", family: "mono", weight: 400, anchor: "end", content: v.toFixed(2), box: tbox(cx + colW, y + 42 * s, 21 * s, monoW("0.00", 21 * s) + 12 * s, { anchor: "end" }) });
    });
    d.raw(bars.join(""));
    marks(d, nums, 16 * s, { role: "mute", family: "mono", weight: 500 });
    d.text("note", L, 770 * s, 15 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 770 * s, 15 * s, 1300 * s) });
  },

  // ---- stat tiles: four white cards with a serif numeral, a delta and a sparkline: 1600 x 900 -------
  "card.index-stats"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s;
    d.text("title", L, 150 * s, 48 * s, { role: "ink", family: "serif", weight: 400, box: tbox(L, 150 * s, 48 * s, 1100 * s) });
    d.text("lede", L, 206 * s, 18 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.55, box: tbox(L, 206 * s, 18 * s, 900 * s, { lines: 2, lh: 1.55 }) });
    const cw = 340 * s; const gap = 16 * s; const cy = 300 * s; const ch = 400 * s; const pad = 26 * s;
    [1, 2, 3, 4].forEach((i, k) => {
      const x = L + k * (cw + gap);
      card(d, x, cy, cw, ch, s);
      d.text(`label_${i}`, x + pad, cy + 46 * s, 17 * s, { role: "ink", family: "sans", weight: 600, box: tbox(x + pad, cy + 46 * s, 17 * s, cw - 2 * pad) });
      d.text(`value_${i}`, x + pad, cy + 140 * s, 76 * s, { role: "ink", family: "serif", weight: 400, content: `${Number(p[`value_${i}`]).toFixed(2)}×`, box: tbox(x + pad, cy + 140 * s, 76 * s, cw - 2 * pad) });
      const delta = Number(p[`delta_${i}`]); const up = delta >= 0; const ty = cy + 196 * s;
      const role = up ? "s4" : "coral";
      const tri = up ? `${f1(x + pad)},${f1(ty)} ${f1(x + pad + 16 * s)},${f1(ty)} ${f1(x + pad + 8 * s)},${f1(ty - 13 * s)}` : `${f1(x + pad)},${f1(ty - 13 * s)} ${f1(x + pad + 16 * s)},${f1(ty - 13 * s)} ${f1(x + pad + 8 * s)},${f1(ty)}`;
      d.raw(`<polygon points="${tri}" fill="${d.pal[role]}" data-role="${role}"/>`);
      const dt = `${up ? "+" : "−"}${Math.abs(delta).toFixed(1)}%`;
      d.text(`delta_${i}`, x + pad + 26 * s, ty, 20 * s, { role: "ink", family: "mono", weight: 400, content: dt, box: tbox(x + pad + 26 * s, ty, 20 * s, monoW(dt, 20 * s) + 10 * s) });
      const nx = x + pad + 26 * s + monoW(dt, 20 * s) + 14 * s;
      d.text(`note_${i}`, nx, ty, 16 * s, { role: "mute", family: "sans", weight: 400, box: tbox(nx, ty, 16 * s, cw - pad - (nx - x) - 4 * s) });
      // the sparkline: a seeded walk ending near the value, an area under it, a dot at the end
      const rnd = mulberry(Math.round(p.seed) * 31 + i * 977); const n = 28; const sx = x + pad; const sw = cw - 2 * pad; const sy0 = cy + 250 * s; const sh = 110 * s;
      let v = 0.5; const pts = [];
      for (let t = 0; t < n; t += 1) { v = Math.max(0.05, Math.min(0.95, v + (rnd() - 0.5 + (up ? 0.04 : -0.04)) * 0.22)); pts.push(v); }
      const X = (t) => sx + (t / (n - 1)) * sw; const Y = (u) => sy0 + sh - u * sh;
      const line = pts.map((u, t) => `${t ? "L" : "M"}${f1(X(t))} ${f1(Y(u))}`).join("");
      d.raw(`<g data-deco="1"><path d="${line}L${f1(X(n - 1))} ${f1(sy0 + sh)}L${f1(X(0))} ${f1(sy0 + sh)}Z" fill="${d.pal.s1}" opacity=".45"/><path d="${line}" fill="none" stroke="${d.pal.s4}" stroke-width="${f1(3 * s)}" stroke-linejoin="round" stroke-linecap="round"/><rect x="${f1(sx)}" y="${f1(sy0 + sh)}" width="${f1(sw)}" height="1" fill="${d.pal.hair}"/><circle cx="${f1(X(n - 1))}" cy="${f1(Y(pts[n - 1]))}" r="${f1(6 * s)}" fill="${d.pal.coral}"/></g>`);
    });
    d.text("caption", L, 770 * s, 15 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 770 * s, 15 * s, 1300 * s) });
  },

  // ---- trend: underlined tabs, three filter controls, a line chart with an expected line: 1600 x 900 -
  "card.index-trend"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s; const R = 1504 * s;
    d.text("title", L, 126 * s, 44 * s, { role: "ink", family: "serif", weight: 400, box: tbox(L, 126 * s, 44 * s, 1100 * s) });
    // tabs: serif 24 / 500, the active one in ink with a 2 underline, the others in the secondary ink
    let tx = L; const active = Math.round(p.active);
    [1, 2, 3].forEach((i) => {
      const text = d.value(`tab_${i}`).text; const w = tw(text, 24 * s, 500, true);
      d.text(`tab_${i}`, tx, 206 * s, 24 * s, { role: i === active ? "ink" : "mute", family: "serif", weight: 500, box: tbox(tx, 206 * s, 24 * s, w + 8 * s) });
      if (i === active) d.rect(tx, 216 * s, w, 2 * s, "ink");
      tx += w + 36 * s;
    });
    d.rect(L, 218 * s, R - L, 1, "hair");
    // filter controls: a small bold label, the chosen value, a hairline under it and a chevron
    [1, 2, 3].forEach((i, k) => {
      const x = L + k * 340 * s;
      d.text(`filter_label_${i}`, x, 258 * s, 13 * s, { role: "mute", family: "sans", weight: 600, box: tbox(x, 258 * s, 13 * s, 280 * s) });
      d.text(`filter_value_${i}`, x, 286 * s, 18 * s, { role: "ink", family: "sans", weight: 400, box: tbox(x, 286 * s, 18 * s, 250 * s) });
      d.rect(x, 298 * s, 300 * s, 1, "cardline");
      d.raw(`<polygon data-deco="1" points="${f1(x + 280 * s)},${f1(278 * s)} ${f1(x + 292 * s)},${f1(278 * s)} ${f1(x + 286 * s)},${f1(285 * s)}" fill="${d.pal.ink}"/>`);
    });
    // the chart panel
    const cx = L; const cy = 326 * s; const cw = R - L; const ch = 478 * s;
    d.raw(`<rect x="${f1(cx)}" y="${f1(cy)}" width="${f1(cw)}" height="${f1(ch)}" rx="${f1(8 * s)}" fill="${d.pal.panel}" data-role="panel"/>`);
    const px0 = 190 * s; const px1 = 1290 * s; const py0 = 366 * s; const py1 = 736 * s;
    const rnd = mulberry(Math.round(p.seed) * 13331 + 5); const n = 60;
    const base = [1.9, 1.25, 0.72];
    const series = base.map((b, k) => { let v = b; const a = []; for (let t = 0; t < n; t += 1) { v = Math.max(0.15, v + (b - v) * 0.06 + (rnd() - 0.5) * p.volatility * 1.6 + (k === 0 ? 0.004 : 0)); a.push(v); } return a; });
    const top = Math.max(3, Math.ceil(Math.max(...series.flat()) + 0.2));
    const X = (t) => px0 + (t / (n - 1)) * (px1 - px0); const Y = (u) => py1 - (u / top) * (py1 - py0);
    let grid = "";
    for (let g = 0; g <= top; g += 1) grid += `<rect x="${f1(px0)}" y="${f1(Y(g))}" width="${f1(px1 - px0)}" height="1" fill="${d.pal.hair}"/>`;
    d.raw(`<g data-deco="1">${grid}</g>`);
    marks(d, Array.from({ length: top + 1 }, (_, g) => [px0 - 14 * s, Y(g) + 5 * s, `${g.toFixed(1)}×`]), 14 * s, { role: "mute", family: "sans", anchor: "end" });
    const cols = ["s4", "blue", "coral"];
    let lines = `<path d="M${f1(px0)} ${f1(Y(1))}H${f1(px1)}" fill="none" stroke="${d.pal.ink}" stroke-width="${f1(1.5 * s)}" stroke-dasharray="${f1(6 * s)} ${f1(5 * s)}"/>`;
    series.forEach((a, k) => { lines += `<path d="${a.map((v, t) => `${t ? "L" : "M"}${f1(X(t))} ${f1(Y(v))}`).join("")}" fill="none" stroke="${d.pal[cols[k]]}" stroke-width="${f1((k === 0 ? 3.4 : 2.6) * s)}" stroke-linejoin="round" stroke-linecap="round"/>`; });
    d.raw(`<g data-deco="1">${lines}</g>`);
    // direct labels at the line ends, pushed apart so none touch; the expected line is labelled the same way
    const ends = series.map((a, k) => ({ name: `series_${k + 1}`, y: Y(a[n - 1]), color: cols[k] })).concat([{ name: "expected", y: Y(1), color: "ink" }]).sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i += 1) ends[i].y = Math.max(ends[i].y, ends[i - 1].y + 28 * s);
    ends.forEach((e) => {
      if (e.name !== "expected") d.raw(`<circle cx="${f1(px1 + 12 * s)}" cy="${f1(e.y - 5 * s)}" r="${f1(5 * s)}" fill="${d.pal[e.color]}" data-role="${e.color}"/>`);
      d.text(e.name, px1 + (e.name === "expected" ? 12 : 26) * s, e.y, 15 * s, { role: "ink", family: "sans", weight: e.name === "expected" ? 400 : 500, box: tbox(px1 + (e.name === "expected" ? 12 : 26) * s, e.y, 15 * s, 190 * s) });
    });
    [[1, 0], [2, 0.34], [3, 0.67], [4, 1]].forEach(([i, f], k) => d.text(`x_${i}`, px0 + f * (px1 - px0), py1 + 34 * s, 14 * s, { role: "mute", family: "sans", weight: 400, anchor: k === 0 ? "start" : k === 3 ? "end" : "middle", box: tbox(px0 + f * (px1 - px0), py1 + 34 * s, 14 * s, 90 * s, { anchor: k === 0 ? "start" : k === 3 ? "end" : "middle" }) }));
    d.text("caption", L, 842 * s, 14 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 842 * s, 14 * s, 1300 * s) });
  },

  // ---- region detail: a serif name, a rank strip, an index bar with its expected mark, a list and a treemap
  "card.index-region"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s; const colR = 800 * s;
    d.text("name", L, 142 * s, 64 * s, { role: "ink", family: "serif", weight: 400, box: tbox(L, 142 * s, 64 * s, 700 * s) });
    d.rect(L, 166 * s, colR - L, 1, "hair");
    // rank: a serif "N / 31" and a strip of 31 cells with the region's cell in blue
    const rank = Math.round(p.rank); const index = Number(p.index);
    d.text("rank_value", L, 244 * s, 52 * s, { role: "ink", family: "serif", weight: 400, content: `${rank} / 31`, box: tbox(L, 244 * s, 52 * s, 190 * s) });
    d.text("rank_label", L, 276 * s, 16 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 276 * s, 16 * s, 190 * s) });
    const sx = 300 * s; const cellW = 14 * s; const cellG = 2 * s; let strip = "";
    for (let i = 0; i < 31; i += 1) { const hit = i === rank - 1; strip += `<rect x="${f1(sx + i * (cellW + cellG))}" y="${f1(208 * s)}" width="${f1(cellW)}" height="${f1(36 * s)}" fill="${d.pal[hit ? "blue" : "mist"]}" data-role="${hit ? "blue" : "mist"}"/>`; }
    d.raw(strip);
    // index: a serif "N ×", a bar scaled 0..6 with the expected mark at 1.0
    d.text("index_value", L, 344 * s, 52 * s, { role: "ink", family: "serif", weight: 400, content: `${index.toFixed(2)} ×`, box: tbox(L, 344 * s, 52 * s, 236 * s) });
    d.text("index_label", L, 376 * s, 16 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 376 * s, 16 * s, 190 * s) });
    const bw = 31 * (cellW + cellG) - cellG; const bx = sx; const by = 322 * s; const bh = 36 * s; const scale = 6;
    d.raw(`<rect x="${f1(bx)}" y="${f1(by)}" width="${f1(Math.min(1, index / scale) * bw)}" height="${f1(bh)}" fill="${d.pal.mist}" data-role="mist"/>`);
    d.raw(`<rect data-deco="1" x="${f1(bx + (1 / scale) * bw - 0.75 * s)}" y="${f1(by - 6 * s)}" width="${f1(1.5 * s)}" height="${f1(bh + 12 * s)}" fill="${d.pal.ink}"/>`);
    d.text("expected", bx + (1 / scale) * bw + 8 * s, by - 8 * s, 13 * s, { role: "ink", family: "sans", weight: 400, box: tbox(bx + (1 / scale) * bw + 8 * s, by - 8 * s, 13 * s, 140 * s) });
    d.rect(L, 404 * s, colR - L, 1, "hair");
    // tabs and the list
    d.text("tab_1", L, 448 * s, 22 * s, { role: "ink", family: "serif", weight: 500, box: tbox(L, 448 * s, 22 * s, 140 * s) });
    const t1 = tw(d.value("tab_1").text, 22 * s, 500, true);
    d.rect(L, 458 * s, t1, 2 * s, "ink");
    d.text("tab_2", L + t1 + 32 * s, 448 * s, 22 * s, { role: "mute", family: "serif", weight: 500, box: tbox(L + t1 + 32 * s, 448 * s, 22 * s, 160 * s) });
    d.text("list_title", L, 492 * s, 17 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 492 * s, 17 * s, 600 * s) });
    // seeded shares, descending; the treemap and the list read the same numbers
    const rnd = mulberry(Math.round(p.seed) * 6571 + 3);
    const raw = Array.from({ length: 6 }, (_, i) => (0.8 - i * 0.1) * (0.9 + rnd() * 0.2)).sort((a, b) => b - a);
    const sum = raw.reduce((a, b) => a + b, 0); const shares = raw.map((v) => (v / sum) * 0.66);
    const nums = [];
    shares.forEach((v, i) => {
      const y = 508 * s + i * 52 * s;
      d.rect(L, y + 52 * s - 1, colR - L, 1, "hair");
      d.raw(`<rect x="${f1(L)}" y="${f1(y + 18 * s)}" width="${f1(13 * s)}" height="${f1(13 * s)}" rx="${f1(2 * s)}" fill="${d.pal[CATS[i]]}" data-role="${CATS[i]}"/>`);
      nums.push([L + 26 * s, y + 34 * s, String(i + 1).padStart(2, "0")]);
      d.text(`item_${i + 1}`, L + 70 * s, y + 34 * s, 20 * s, { role: "ink", family: "sans", weight: 400, box: tbox(L + 70 * s, y + 34 * s, 20 * s, 440 * s) });
      const pc = `${(v * 100).toFixed(1)}%`;
      d.text(`pct_${i + 1}`, colR, y + 34 * s, 20 * s, { role: "ink", family: "mono", weight: 400, anchor: "end", content: pc, box: tbox(colR, y + 34 * s, 20 * s, monoW(pc, 20 * s) + 12 * s, { anchor: "end" }) });
    });
    marks(d, nums, 16 * s, { role: "mute", family: "mono", weight: 500 });
    // the treemap panel
    const qx = 880 * s; const qw = 624 * s;
    d.raw(`<rect x="${f1(qx)}" y="${f1(80 * s)}" width="${f1(qw)}" height="${f1(772 * s)}" rx="${f1(8 * s)}" fill="${d.pal.panel}" data-role="panel"/>`);
    d.text("tree_title", qx + 24 * s, 124 * s, 18 * s, { role: "ink", family: "sans", weight: 600, box: tbox(qx + 24 * s, 124 * s, 18 * s, qw - 48 * s) });
    d.text("tree_hint", qx + 24 * s, 152 * s, 14 * s, { role: "mute", family: "sans", weight: 400, box: tbox(qx + 24 * s, 152 * s, 14 * s, qw - 48 * s) });
    const rects = treemap(shares, qx + 24 * s, 176 * s, qw - 48 * s, 610 * s);
    d.raw(rects.map(([x, y, w, h], i) => `<rect x="${f1(x + 1 * s)}" y="${f1(y + 1 * s)}" width="${f1(Math.max(0, w - 2 * s))}" height="${f1(Math.max(0, h - 2 * s))}" fill="${d.pal[CATS[i]]}" data-role="${CATS[i]}"/>`).join(""));
    d.text("tree_note", qx + 24 * s, 820 * s, 13 * s, { role: "mute", family: "sans", weight: 400, box: tbox(qx + 24 * s, 820 * s, 13 * s, qw - 48 * s) });
  },
};

module.exports = { LAYOUTS };
