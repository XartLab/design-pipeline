"use strict";

// Layouts of the devlog-terminal style pack (styles/devlog-terminal/style.json): the grammar of a
// developer technical-writing blog that speaks in terminal conventions, read and measured privately
// in Chrome on a public blog the owner named (2026-11-21) and never shipped. A near-black ground and
// warm off-white ink, monospace for everything that is chrome (hotkey nav, labels, dates, section
// heads), a neutral grotesque for titles and prose, hairlines instead of boxes, one inverted button,
// and one clay accent that only ever appears as a filled square tile carrying a 1-bit pixel glyph
// (or as the mascot). Geometry in 1440-unit canvases scaled to the render. Everything is drawn here:
// the pixel glyphs are our own, the mascot is an image slot the owner fills with their own art.

const { f1, esc, invalid, rng } = require("./layout-kit.cjs");
const measure = require("./measure.cjs");

// ---- type ------------------------------------------------------------------------------------
// A mono role carries Latin chrome. Copy it cannot set (CJK, symbols past the box-drawing blocks)
// moves, whole string, to the sans role of the same weight, so a line never mixes two faces.
const SANS_OF = { mono: "sans", monom: "title" };
const isMono = (family) => family === "mono" || family === "monom";
const WIDE = /[ᄀ-ᇿ⺀-鿿가-퟿豈-﫿︰-﹏＀-￦]/;
const MONO_SAFE = /^[ -~ -ÿ←-⇿─-▟]*$/;
const monoAdvance = (text, size, spacing) => {
  const chars = [...String(text)];
  return chars.reduce((sum, ch) => sum + (WIDE.test(ch) ? 1 : 0.6) * size, 0) + spacing * Math.max(0, chars.length - 1);
};

// Text slot with a measured box. (x, y) is the baseline start (centre or end by anchor). boxW fixes
// the box width (a column), otherwise the box is the copy's own width, taking the wider of the check's
// proportional model and true monospace advances. Returns the advance used for laying neighbours out.
function put(d, name, x, y, size, o = {}) {
  const { spec, text } = d.value(name);
  const str = o.content !== undefined ? String(o.content) : String(text);
  let family = o.family || "sans";
  if (SANS_OF[family] && !MONO_SAFE.test(str)) family = SANS_OF[family];
  const weight = o.weight || d.roles[family].weight;
  const spacing = ((o.tracking || 0) / 1000) * size;
  const anchor = o.anchor || "start";
  const lines = spec.lines || 1;
  const lh = o.lineHeight || 1.3;
  const est = measure.textWidth(str, size, spacing, { weight });
  const adv = isMono(family) ? monoAdvance(str, size, spacing) : est;
  const pad = 3 * d.k;
  const w = o.boxW ?? Math.max(est, adv) + 2 * pad;
  const x0 = anchor === "start" ? x - pad : anchor === "middle" ? x - w / 2 : x - w + pad;
  const box = [x0, y - size, w, size * (1.25 + (lines - 1) * lh)];
  d.text(name, x, y, size, { role: o.role || "ink", family, weight, tracking: o.tracking, anchor, box, lineHeight: lh, content: o.content });
  return adv;
}

// ---- drawing pieces --------------------------------------------------------------------------
const hline = (d, x1, x2, y, s, role = "hair") => d.raw(`<line x1="${f1(x1)}" y1="${f1(y)}" x2="${f1(x2)}" y2="${f1(y)}" stroke="${d.pal[role]}" stroke-width="${f1(Math.max(1, s))}" data-deco="1"/>`);
const vline = (d, x, y1, y2, s, role = "hair") => d.raw(`<line x1="${f1(x)}" y1="${f1(y1)}" x2="${f1(x)}" y2="${f1(y2)}" stroke="${d.pal[role]}" stroke-width="${f1(Math.max(1, s))}" data-deco="1"/>`);

// 1-bit pixel glyphs, 9 x 9, drawn by this pack (own work; no pixel art is borrowed).
const GLYPHS = {
  bug: [".#.....#.", "..#...#..", "...###...", ".#######.", "##.###.##", ".#######.", "##.###.##", "...###...", "..#...#.."],
  check: ["#########", "#.......#", "#.....#.#", "#....##.#", "#.#.##..#", "#.###...#", "#..#....#", "#.......#", "#########"],
  flask: ["..#####..", "...#.#...", "...#.#...", "...#.#...", "..#...#..", ".#..#..#.", "#..###..#", "#.#####.#", "#########"],
  chart: ["#........", "#.....#..", "#.....#..", "#..#..#..", "#..#..#.#", "#..#.##.#", "#.##.##.#", "#.##.##.#", "#########"],
  prompt: ["#########", "#.......#", "#.#.....#", "#..#....#", "#...#...#", "#..#....#", "#.#..##.#", "#.......#", "#########"],
  bolt: ["....###..", "...###...", "..###....", ".######..", "...###...", "..###....", ".###.....", ".##......", ".#......."],
};
const GLYPH_NAMES = Object.keys(GLYPHS);

// Clay tile with a pixel glyph: the pack's only use of the accent besides the mascot. The glyph is
// drawn as one path of horizontal runs (decoration: it carries no text).
function tile(d, x, y, size, glyph) {
  d.raw(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(size)}" height="${f1(size)}" fill="${d.pal.clay}" data-role="clay"/>`);
  const rows = GLYPHS[glyph] || GLYPHS.bug;
  const u = size / 12; const ox = x + 1.5 * u; const oy = y + 1.5 * u;
  let path = "";
  rows.forEach((row, r) => {
    for (const run of row.matchAll(/#+/g)) path += `M${f1(ox + run.index * u)} ${f1(oy + r * u)}h${f1(run[0].length * u)}v${f1(u)}h${f1(-run[0].length * u)}z`;
  });
  d.raw(`<path d="${path}" fill="${d.pal.ground}" data-role="ground" data-deco="1"/>`);
}

// Branch glyph that stands in for the box-drawing corner: a short vertical with a foot, drawn so the
// line does not depend on which monospace face renders the page.
function branch(d, x, cy, s, role = "mute") {
  d.raw(`<path data-deco="1" d="M${f1(x)} ${f1(cy - 14 * s)}V${f1(cy)}H${f1(x + 10 * s)}" fill="none" stroke="${d.pal[role]}" stroke-width="${f1(1.3 * s)}"/>`);
}

// Top navigation shared by the index and the article: a mascot slot, bracketed hotkeys in mono, and one
// inverted button at the right. The current hotkey is ink, the others body grey.
function topNav(d, s) {
  const { W, p } = d;
  d.image("mascot", 48 * s, 18 * s, 36 * s, 36 * s, "", { labelAt: [0.5, 0.5] });
  let x = 112 * s;
  for (let i = 1; i <= 4; i += 1) {
    const adv = put(d, `nav_${i}`, x, 41 * s, 13 * s, { role: i === p.current ? "ink" : "body", family: "mono", tracking: 40 });
    x += adv + 32 * s;
  }
  const { text: cta } = d.value("cta");
  const w = monoAdvance(cta, 13 * s, 0.04 * 13 * s) + 36 * s;
  d.raw(`<rect x="${f1(W - 48 * s - w)}" y="${f1(18 * s)}" width="${f1(w)}" height="${f1(36 * s)}" fill="${d.pal.ink}" data-role="ink"/>`);
  put(d, "cta", W - 48 * s - w / 2, 41 * s, 13 * s, { role: "ground", family: "monom", tracking: 40, anchor: "middle" });
  hline(d, 0, W, 72 * s, s);
}

const FILL = (n, glyphs, offset) => Array.from({ length: n }, (_, i) => glyphs[(i + offset) % glyphs.length]);

const LAYOUTS = {
  // ---- index page: nav, brand column, filter tabs, featured row, post rows: 1440 x 900 --------------
  "ui.devlog-index"(d) {
    const { W, H, p } = d; const s = W / 1440;
    d.rect(0, 0, W, H, "ground");
    topNav(d, s);
    vline(d, 392 * s, 72 * s, H, s);
    // brand column: site name in mono, a one-line tagline
    put(d, "brand", 48 * s, 136 * s, 31.5 * s, { role: "ink", family: "mono", boxW: 330 * s });
    put(d, "tagline", 48 * s, 172 * s, 15.75 * s, { role: "mute", family: "sans", boxW: 330 * s });
    // filter tabs and the search hotkey
    let x = 424 * s;
    for (let i = 1; i <= 5; i += 1) x += put(d, `tab_${i}`, x, 118 * s, 13 * s, { role: i === Math.round(p.active) ? "ink" : "mute", family: "mono", tracking: 60 }) + 28 * s;
    put(d, "search", 1392 * s, 118 * s, 13 * s, { role: "mute", family: "mono", tracking: 60, anchor: "end" });
    hline(d, 424 * s, 1392 * s, 146 * s, s);
    // featured row: a large clay tile, the white tag and category, a big title, the author
    tile(d, 424 * s, 170 * s, 192 * s, p.glyph);
    const tx = 664 * s;
    const tagW = monoAdvance(d.value("feature_tag").text, 12 * s, 0.06 * 12 * s) + 18 * s;
    d.raw(`<rect x="${f1(tx)}" y="${f1(172 * s)}" width="${f1(tagW)}" height="${f1(24 * s)}" fill="${d.pal.ink}" data-role="ink"/>`);
    put(d, "feature_tag", tx + tagW / 2, 188.5 * s, 12 * s, { role: "ground", family: "monom", tracking: 60, anchor: "middle" });
    put(d, "feature_cat", tx + tagW + 16 * s, 188.5 * s, 12 * s, { role: "mute", family: "mono", tracking: 60 });
    put(d, "feature_title", tx, 250 * s, 32 * s, { role: "ink", family: "title", boxW: 700 * s, lineHeight: 1.2 });
    put(d, "feature_author", tx, 346 * s, 13 * s, { role: "body", family: "mono", tracking: 40 });
    hline(d, 424 * s, 1392 * s, 386 * s, s);
    // post rows separated by hairlines: tile icon, mono date, sans title, read time at the right
    const n = Math.round(p.rows);
    const glyphs = FILL(8, GLYPH_NAMES, Math.round(p.glyph_offset));
    for (let i = 1; i <= n; i += 1) {
      const y0 = 386 * s + (i - 1) * 46 * s; const cy = y0 + 23 * s;
      tile(d, 424 * s, cy - 14 * s, 28 * s, glyphs[i - 1]);
      put(d, `row_date_${i}`, 476 * s, cy + 4.5 * s, 13 * s, { role: "mute", family: "mono", tracking: 20 });
      put(d, `row_title_${i}`, 588 * s, cy + 6 * s, 18 * s, { role: "ink", family: "sans", boxW: 694 * s });
      put(d, `row_time_${i}`, 1392 * s, cy + 4.5 * s, 13 * s, { role: "mute", family: "mono", tracking: 40, anchor: "end" });
      hline(d, 424 * s, 1392 * s, y0 + 46 * s, s);
    }
    // load more, with its keyboard hint
    const ly = 386 * s + n * 46 * s + 32 * s;
    const lw = monoAdvance(d.value("load_more").text, 13 * s, 0.06 * 13 * s) + 44 * s;
    d.raw(`<rect x="${f1(424 * s)}" y="${f1(ly)}" width="${f1(lw)}" height="${f1(36 * s)}" fill="none" stroke="${d.pal.dim}" stroke-width="${f1(Math.max(1, s))}" data-deco="1"/>`);
    put(d, "load_more", 424 * s + lw / 2, ly + 23 * s, 13 * s, { role: "ink", family: "mono", tracking: 60, anchor: "middle" });
    put(d, "hint", 424 * s + lw + 20 * s, ly + 22.5 * s, 12 * s, { role: "mute", family: "mono", tracking: 20 });
  },

  // ---- article page: left rail with TREE and progress, body column: 1440 x 900 --------------------------
  "ui.devlog-article"(d) {
    const { W, H, p } = d; const s = W / 1440;
    d.rect(0, 0, W, H, "ground");
    topNav(d, s);
    vline(d, 384 * s, 72 * s, H, s);
    // sticky rail: title, TREE with branch glyphs and nesting, ASCII progress, read time, SHARE
    put(d, "rail_title", 48 * s, 118 * s, 20 * s, { role: "ink", family: "title", boxW: 288 * s, lineHeight: 1.3 });
    put(d, "tree_label", 48 * s, 226 * s, 12 * s, { role: "mute", family: "mono", tracking: 100 });
    const LEVEL = [0, 1, 1, 0, 1, 1, 0];
    const items = Math.round(p.tree_items); const cur = Math.round(p.current);
    for (let i = 1; i <= items; i += 1) {
      const y = 256 * s + (i - 1) * 26 * s; const x = 48 * s + LEVEL[i - 1] * 20 * s;
      branch(d, x + 3 * s, y - 4.5 * s, s);
      put(d, `tree_${i}`, x + 20 * s, y, 13 * s, { role: i === cur ? "ink" : "mute", family: "mono", weight: i === cur ? 700 : 400, tracking: 20, boxW: 352 * s - (x + 20 * s) });
    }
    const py = 256 * s + items * 26 * s + 26 * s;
    const blocks = 20; const lit = Math.round((Math.max(0, Math.min(100, p.progress)) / 100) * blocks);
    let on = ""; let off = "";
    for (let i = 0; i < blocks; i += 1) {
      const r = `<rect x="${f1(48 * s + i * 10 * s)}" y="${f1(py - 12 * s)}" width="${f1(8 * s)}" height="${f1(14 * s)}"/>`;
      if (i < lit) on += r; else off += r;
    }
    d.raw(`<g data-deco="1"><g fill="${d.pal.body}">${on}</g><g fill="${d.pal.dim}">${off}</g></g>`);
    put(d, "percent", 48 * s + blocks * 10 * s + 8 * s, py, 13 * s, { role: "ink", family: "mono", tracking: 20, content: `${Math.round(p.progress)}%` });
    put(d, "read_time", 48 * s, py + 40 * s, 12 * s, { role: "mute", family: "mono", tracking: 100 });
    put(d, "share_label", 48 * s, py + 96 * s, 12 * s, { role: "mute", family: "mono", tracking: 100 });
    for (let i = 1; i <= 3; i += 1) {
      const y = py + 126 * s + (i - 1) * 26 * s;
      branch(d, 51 * s, y - 4.5 * s, s);
      put(d, `share_${i}`, 68 * s, y, 13 * s, { role: "body", family: "mono", tracking: 40 });
    }
    // body column (about 620 wide): mono section head, prose, list with a bold ink lead term, sub-section
    const cx = 602 * s; const cw = 620 * s;
    put(d, "sec_title", cx, 148 * s, 15.75 * s, { role: "ink", family: "monom", tracking: 60 });
    put(d, "para_1", cx, 190 * s, 18 * s, { role: "body", family: "sans", boxW: cw, lineHeight: 1.6 });
    for (let i = 1; i <= 3; i += 1) {
      const y = 346 * s + (i - 1) * 34 * s;
      d.raw(`<rect data-deco="1" x="${f1(cx)}" y="${f1(y - 9 * s)}" width="${f1(5 * s)}" height="${f1(5 * s)}" fill="${d.pal.dim}"/>`);
      const lead = put(d, `item_lead_${i}`, cx + 22 * s, y, 18 * s, { role: "ink", family: "sans", weight: 600 });
      // the continuation starts one normal space (0.28 em) after the lead term: the model reads Latin
      // bold Inter about 3% wide, so that share is taken back; CJK advances are exact
      const latin = [...String(d.value(`item_lead_${i}`).text)].filter((ch) => !WIDE.test(ch)).join("");
      const rx = cx + 22 * s + lead - 0.03 * measure.textWidth(latin, 18 * s, 0, { weight: 600 }) + 0.28 * 18 * s;
      put(d, `item_rest_${i}`, rx, y, 18 * s, { role: "body", family: "sans", boxW: cx + cw - rx });
    }
    put(d, "sub_title", cx, 470 * s, 15.75 * s, { role: "ink", family: "monom" });
    put(d, "para_2", cx, 510 * s, 18 * s, { role: "body", family: "sans", boxW: cw, lineHeight: 1.6 });
  },

  // ---- article header: tile, title, deck, three meta columns: 1440 x 560 ------------------------------
  "ui.devlog-article-header"(d) {
    const { W, H, p } = d; const s = W / 1440; const c = W / 2;
    d.rect(0, 0, W, H, "ground");
    tile(d, c - 40 * s, 64 * s, 80 * s, p.glyph);
    put(d, "title", c, 206 * s, 36 * s, { role: "ink", family: "title", anchor: "middle", boxW: 800 * s, lineHeight: 1.2 });
    put(d, "deck", c, 306 * s, 18 * s, { role: "body", family: "sans", anchor: "middle", boxW: 640 * s, lineHeight: 1.6 });
    hline(d, 360 * s, 1080 * s, 392 * s, s);
    hline(d, 360 * s, 1080 * s, 484 * s, s);
    for (let i = 1; i <= 3; i += 1) {
      const mx = c + (i - 2) * 240 * s;
      put(d, `meta_label_${i}`, mx, 424 * s, 12 * s, { role: "mute", family: "mono", tracking: 100, anchor: "middle", boxW: 216 * s });
      put(d, `meta_${i}`, mx, 458 * s, 15.75 * s, { role: "ink", family: "sans", anchor: "middle", boxW: 216 * s });
      if (i < 3) vline(d, mx + 120 * s, 392 * s, 484 * s, s);
    }
  },

  // ---- figure frame: picture and a FIG label caption box: 960 x 600 -------------------------------------
  "card.devlog-fig"(d) {
    const { W, H, p } = d; const s = W / 960;
    d.rect(0, 0, W, H, "ground");
    const ch = 80 * s; const iy = H - ch; const lw = p.label_w * s;
    d.image("media", 0, 0, W, iy, "figure, 12:11", { labelAt: [0.5, 0.5] });
    if (p.frame) d.raw(`<rect data-deco="1" x="${f1(0.5 * s)}" y="${f1(0.5 * s)}" width="${f1(W - s)}" height="${f1(H - s)}" fill="none" stroke="${d.pal.hair}" stroke-width="${f1(Math.max(1, s))}"/>`);
    hline(d, 0, W, iy, s);
    vline(d, lw, iy, H, s);
    put(d, "label", 20 * s, iy + ch / 2 + 4.5 * s, 13 * s, { role: "ink", family: "mono", tracking: 100 });
    put(d, "caption", lw + 24 * s, iy + 33 * s, 15.75 * s, { role: "mute", family: "sans", boxW: W - lw - 48 * s, lineHeight: 1.45 });
  },

  // ---- dot-matrix field with a mascot slot in the middle: 1440 x 480 -----------------------------------
  "banner.devlog-dotfield"(d) {
    const { W, H, p } = d; const s = W / 1440;
    d.rect(0, 0, W, H, "ground");
    const seed = Math.round(p.seed);
    const rnd = rng(seed * 7919 + 13);
    const blobs = Array.from({ length: 4 }, () => ({ x: rnd() * W, y: rnd() * H, rx: (150 + rnd() * 280) * s, ry: (70 + rnd() * 130) * s }));
    const pitch = 24 * s; const cx = W / 2; const cy = H / 2; const hole = 118 * s;
    const classes = [[], [], [], []];
    for (let y = pitch / 2; y < H; y += pitch) {
      for (let x = pitch / 2; x < W; x += pitch) {
        if (Math.hypot(x - cx, y - cy) < hole) continue;
        if ((x < 280 * s || x > W - 380 * s) && y > H - 76 * s) continue; // the label and the hint keep a clear ground
        const v = Math.max(...blobs.map((b) => Math.exp(-(((x - b.x) / b.rx) ** 2 + ((y - b.y) / b.ry) ** 2)))) * (0.88 + 0.24 * rnd());
        const level = (v - (1 - p.density)) / p.density;
        if (level <= 0.08) continue;
        classes[Math.min(3, Math.floor(level * 4))].push([x, y]);
      }
    }
    classes.forEach((dots, q) => {
      if (!dots.length) return;
      const r = (1.2 + q * 0.85) * s;
      d.raw(`<g data-deco="1" fill="${d.pal[q === 3 ? "mute" : "dim"]}">${dots.map(([x, y]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`).join("")}</g>`);
    });
    d.image("mascot", cx - 72 * s, cy - 72 * s, 144 * s, 144 * s, "your mascot", { labelAt: [0.5, 0.5] });
    put(d, "field_label", 48 * s, H - 36 * s, 12 * s, { role: "mute", family: "mono", tracking: 100, content: `FIELD ${String(seed).padStart(3, "0")}` });
    put(d, "hint", W - 48 * s, H - 36 * s, 12 * s, { role: "mute", family: "mono", tracking: 60, anchor: "end" });
  },
};

module.exports = { LAYOUTS, GLYPHS, GLYPH_NAMES };
