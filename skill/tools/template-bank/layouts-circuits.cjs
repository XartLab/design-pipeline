"use strict";

// Layouts of the circuits-paper style pack (styles/circuits-paper/style.json): the grammar of an
// interactive interpretability research paper thread (a Distill-lineage scientific article), measured in
// Chrome on public reference pages the owner named (kept private, never shipped). A white page, a plain
// grotesque for prose and labels, a wide byline grid with small kickers, a reading column with a margin
// gutter, numbered figure captions, token strips with activation-coloured highlights, node-link
// attribution graphs in beige nodes and mauve edges, a sticky table of contents and footnote preview
// cards. Geometry in a 1600-unit canvas scaled to the size. Everything is drawn here; the faces are named
// (IBM Plex Sans, Roboto Mono, STIX Two Text, Noto), never bundled.

const { f1, esc } = require("./layout-kit.cjs");
const measure = require("./measure.cjs");

const DARK = { white: "#141414", ink: "#F5F5F5", text: "#D9D9D6", mute: "#A6A6A1", faint: "#8C8C87", rule: "#34342F", node: "#1E1E1C", stone: "#5C5B55", tile: "#3A3934", link: "#86BDEB", maroon: "#D79A9A", mauve: "#D883A3", lavender: "#B3A6EE" };
const WIDE = /[ᄀ-ᇿ⺀-鿿가-퟿豈-﫿︰-﹏＀-￦]/;

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

// The slot's text box for the static check: the extent is [x0, baseline - 0.88 size] over size x lines.
function tbox(x, y, size, w, { lines = 1, lh = 1.3, anchor = "start" } = {}) {
  const x0 = anchor === "start" ? x : anchor === "middle" ? x - w / 2 : x - w;
  return [x0 - 2, y - 0.88 * size - 2, w + 4, size * (1 + (lines - 1) * lh) + 4];
}
const tw = (text, size, weight = 400) => measure.textWidth(text, size, 0, { serif: false, weight });
// Monospace advance: CJK and full-width forms are one em wide, everything else 0.6 em.
const monoW = (text, size) => [...String(text)].reduce((sum, ch) => sum + (WIDE.test(ch) ? 1 : 0.6) * size, 0);

function begin(d) {
  if (d.p.theme === "dark") Object.assign(d.pal, DARK);
  d.rect(0, 0, d.W, d.H, "white");
}

// A mono slot: the box takes the wider of the check's proportional model and true monospace advances.
function mono(d, name, x, y, size, o = {}) {
  const { text } = d.value(name);
  const str = o.content !== undefined ? String(o.content) : String(text);
  const w = Math.max(tw(str, size, o.weight || 400), monoW(str, size)) + 6 * d.k;
  const anchor = o.anchor || "start";
  const x0 = anchor === "start" ? x - 3 * d.k : anchor === "middle" ? x - w / 2 : x - w + 3 * d.k;
  d.text(name, x, y, size, { role: o.role || "ink", family: "mono", weight: o.weight || 400, anchor, content: o.content, box: [x0, y - 0.88 * size - 2, w, size * 1.25 + 2] });
  return monoW(str, size);
}

// The brand mark: three nodes joined by two edges (our own drawing), decoration.
function mark(d, x, y, s) {
  const r = 5.5 * s;
  d.raw(`<g data-deco="1"><path d="M${f1(x + r)} ${f1(y + 10 * s)}L${f1(x + 15 * s)} ${f1(y - 6 * s)}L${f1(x + 30 * s)} ${f1(y + 8 * s)}" fill="none" stroke="${d.pal.mauve}" stroke-width="${f1(2 * s)}" stroke-linecap="round"/>`
    + `<circle cx="${f1(x + r)}" cy="${f1(y + 10 * s)}" r="${f1(r)}" fill="${d.pal.node}" stroke="${d.pal.stone}" stroke-width="${f1(2 * s)}"/>`
    + `<circle cx="${f1(x + 15 * s)}" cy="${f1(y - 6 * s)}" r="${f1(r)}" fill="${d.pal.maroon}" stroke="${d.pal.maroon}" stroke-width="${f1(2 * s)}" data-role="maroon"/>`
    + `<circle cx="${f1(x + 30 * s)}" cy="${f1(y + 8 * s)}" r="${f1(r)}" fill="${d.pal.node}" stroke="${d.pal.stone}" stroke-width="${f1(2 * s)}"/></g>`);
}

const hair = (d, x, y, w, s, role = "rule") => d.rect(x, y, w, Math.max(1, s), role);

// A panel: white (the page), 1 unit hairline in the rule grey, radius 5 (measured on the reference's tiles).
function panel(d, x, y, w, h, s, fill = "white") {
  d.raw(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(5 * s)}" fill="${d.pal[fill]}" stroke="${d.pal.rule}" stroke-width="${f1(Math.max(1, s))}" data-role="${fill}"/>`);
}

// One token row: a bordered strip with tokens set from their own x, highlighted by activation. The row is one
// slot value (tokens separated by spaces) drawn as one <text> per token, each carrying the slot name and its
// own box, so the check measures every token where it is; the highlight rects sit under the tokens as the
// text's ground. Activations are quantised to the three hot roles.
function tokenRow(d, name, x, y, w, h, size, acts, s) {
  const { spec, text } = d.value(name);
  const tokens = String(text).trim().split(/\s+/).filter(Boolean);
  const pad = 12 * s; const gap = 8 * s; const base = y + h / 2 + 0.34 * size;
  d.raw(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(4 * s)}" fill="${d.pal.node}" stroke="${d.pal.stone}" stroke-width="${f1(Math.max(1, s))}" data-role="node"/>`);
  let cx = x + pad + 4 * s; let hi = ""; let marks = "";
  tokens.forEach((tok, i) => {
    const tokW = monoW(tok, size);
    const a = acts[i] || 0;
    if (a >= 0.12) {
      const role = a >= 0.66 ? "hot_hi" : a >= 0.33 ? "hot_mid" : "hot_lo";
      hi += `<rect x="${f1(cx - 5 * s)}" y="${f1(y + 7 * s)}" width="${f1(tokW + 10 * s)}" height="${f1(h - 14 * s)}" rx="${f1(3 * s)}" fill="${d.pal[role]}" data-role="${role}"/>`;
    }
    const chosen = d.familyFor("mono", tok, 400);
    const box = [cx - 3 * s, y + 6 * s, Math.max(1, Math.min(Math.max(tokW, tw(tok, size)) + 6 * s, x + w - 6 * s - (cx - 3 * s))), h - 12 * s];
    marks += `<text ${d.slotAttrs(name, spec, { box })} x="${f1(cx)}" y="${f1(base)}" font-family="${esc(chosen.css)}" font-weight="400" font-size="${f1(size)}" fill="${a >= 0.12 ? d.pal.onhot : d.pal.ink}" data-role="${a >= 0.12 ? "onhot" : "ink"}" text-anchor="start" data-font-role="mono">${esc(tok)}</text>`;
    cx += tokW + gap + 10 * s;
  });
  d.raw(hi + marks);
}

// Edge between two points: a vertical cubic, the curve of an attribution graph.
const edge = (x1, y1, x2, y2) => {
  const m = (y1 + y2) / 2;
  return `M${f1(x1)} ${f1(y1)}C${f1(x1)} ${f1(m)} ${f1(x2)} ${f1(m)} ${f1(x2)} ${f1(y2)}`;
};

const LAYOUTS = {
  // ---- paper title and byline: 1600 x 900 -------------------------------------------------------------
  "cover.circuits-title"(d) {
    const { W, H } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s; const colW = 1160 * s;
    mark(d, L, 70 * s, s);
    d.text("brand", L + 56 * s, 78 * s, 17 * s, { role: "text", family: "sans", weight: 500, box: tbox(L + 56 * s, 78 * s, 17 * s, 640 * s) });
    hair(d, 0, 118 * s, W, s);
    const ts = 66 * s;
    d.text("title_1", L, 240 * s, ts, { role: "ink", family: "sans", weight: 700, box: tbox(L, 240 * s, ts, colW) });
    d.text("title_2", L, 322 * s, ts, { role: "ink", family: "sans", weight: 700, box: tbox(L, 322 * s, ts, colW) });
    d.text("deck", L, 384 * s, 22 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 384 * s, 22 * s, colW) });
    // byline: authors on the left, affiliation and publication stacked in the right column
    const by = 430 * s;
    hair(d, 0, by, W, s);
    const rx = 1116 * s;
    d.text("k_authors", L, by + 42 * s, 13 * s, { role: "mute", family: "sans", weight: 600, tracking: 90, box: tbox(L, by + 42 * s, 13 * s, 160 * s) });
    d.text("authors", L, by + 80 * s, 19 * s, { role: "text", family: "sans", weight: 400, lineHeight: 1.5, box: tbox(L, by + 80 * s, 19 * s, 900 * s, { lines: 3, lh: 1.5 }) });
    d.text("k_affil", rx, by + 42 * s, 13 * s, { role: "mute", family: "sans", weight: 600, tracking: 90, box: tbox(rx, by + 42 * s, 13 * s, 160 * s) });
    d.text("affiliation", rx, by + 80 * s, 19 * s, { role: "text", family: "sans", weight: 400, box: tbox(rx, by + 80 * s, 19 * s, 388 * s) });
    d.text("k_pub", rx, by + 134 * s, 13 * s, { role: "mute", family: "sans", weight: 600, tracking: 90, box: tbox(rx, by + 134 * s, 13 * s, 160 * s) });
    d.text("published", rx, by + 172 * s, 19 * s, { role: "text", family: "sans", weight: 400, box: tbox(rx, by + 172 * s, 19 * s, 388 * s) });
    d.text("note", L, by + 196 * s, 15 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, by + 196 * s, 15 * s, 900 * s) });
    hair(d, 0, by + 232 * s, W, s);
    // the abstract opens the article below the byline
    d.text("abstract_label", L, by + 290 * s, 17 * s, { role: "ink", family: "sans", weight: 700, box: tbox(L, by + 290 * s, 17 * s, 200 * s) });
    d.text("abstract", L + 96 * s, by + 290 * s, 20 * s, { role: "text", family: "sans", weight: 400, lineHeight: 1.7, box: tbox(L + 96 * s, by + 290 * s, 20 * s, 1000 * s, { lines: 3, lh: 1.7 }) });
    d.zone("copy", "safe", [0, 0, W, H], { slots: ["brand", "title_1", "title_2", "deck", "k_authors", "authors", "k_affil", "affiliation", "k_pub", "published", "note", "abstract_label", "abstract"] });
  },

  // ---- figure with a margin note and a numbered caption: 1600 x 900 -----------------------------------------
  "card.circuits-figure"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s; const fw = 1004 * s; const fy = 150 * s; const fh = 560 * s;
    panel(d, L, fy, fw, fh, s);
    d.text("fig_title", L + fw / 2, fy + 46 * s, 17 * s, { role: "ink", family: "sans", weight: 700, anchor: "middle", box: tbox(L + fw / 2, fy + 46 * s, 17 * s, 760 * s, { anchor: "middle" }) });
    // schematic: a residual stream (tall bar) with `layers` blocks reading from it and writing back, token tiles below
    const n = Math.round(p.layers); const cols = Math.round(p.tokens);
    const gx0 = L + 70 * s; const gx1 = L + fw - 70 * s; const top = fy + 96 * s; const bot = fy + fh - 128 * s;
    const colW = (gx1 - gx0) / cols;
    const cx = Array.from({ length: cols }, (_, i) => gx0 + colW * (i + 0.5));
    let shapes = ""; let arrows = "";
    cx.forEach((x) => {
      shapes += `<rect x="${f1(x - 5 * s)}" y="${f1(top)}" width="${f1(10 * s)}" height="${f1(bot - top)}" rx="${f1(5 * s)}" fill="${d.pal.tile}" data-role="tile"/>`;
      for (let l = 0; l < n; l += 1) {
        const y = bot - (l + 0.5) * ((bot - top) / n);
        const bw = Math.min(colW * 0.52, 120 * s); const bh = 34 * s;
        shapes += `<rect x="${f1(x + 22 * s)}" y="${f1(y - bh / 2)}" width="${f1(bw)}" height="${f1(bh)}" rx="${f1(5 * s)}" fill="${d.pal.node}" stroke="${d.pal.stone}" stroke-width="${f1(2 * s)}" data-role="node"/>`;
        const xb = x + 22 * s; const mid = xb + bw / 2; const up = y - bh / 2 - 24 * s;
        // read: stream to block; write: block up and back to the stream, with arrowheads
        arrows += `<path d="M${f1(x + 5 * s)} ${f1(y)}H${f1(xb - 2 * s)}M${f1(xb - 9 * s)} ${f1(y - 5 * s)}L${f1(xb - 2 * s)} ${f1(y)}L${f1(xb - 9 * s)} ${f1(y + 5 * s)}M${f1(mid)} ${f1(y - bh / 2)}V${f1(up)}H${f1(x + 7 * s)}M${f1(x + 14 * s)} ${f1(up - 5 * s)}L${f1(x + 7 * s)} ${f1(up)}L${f1(x + 14 * s)} ${f1(up + 5 * s)}" fill="none" stroke="${d.pal.mauve}" stroke-width="${f1(2 * s)}" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
    });
    d.raw(`<g data-deco="1">${shapes}${arrows}</g>`);
    // block names inside the first stream's blocks
    for (let l = 0; l < n; l += 1) {
      const y = bot - (l + 0.5) * ((bot - top) / n); const bw = Math.min(colW * 0.52, 120 * s);
      d.text(`block_${l + 1}`, cx[0] + 22 * s + bw / 2, y + 5.5 * s, 16 * s, { role: "ink", family: "sans", weight: 500, anchor: "middle", box: tbox(cx[0] + 22 * s + bw / 2, y + 5.5 * s, 16 * s, bw - 14 * s, { anchor: "middle" }) });
    }
    // token tiles under each stream, mono on the beige tile
    for (let i = 1; i <= cols; i += 1) {
      const tx = cx[i - 1]; const ty = fy + fh - 62 * s; const tileW = Math.min(colW - 18 * s, 170 * s);
      d.raw(`<rect x="${f1(tx - tileW / 2)}" y="${f1(ty - 30 * s)}" width="${f1(tileW)}" height="${f1(46 * s)}" rx="${f1(3 * s)}" fill="${d.pal.tile}" data-role="tile"/>`);
      mono(d, `tok_${i}`, tx, ty + 2 * s, 20 * s, { anchor: "middle", role: "ink" });
    }
    d.text("stream_label", cx[0] - 5 * s, top - 14 * s, 15 * s, { role: "mute", family: "sans", weight: 400, box: tbox(cx[0] - 5 * s, top - 14 * s, 15 * s, 200 * s) });
    // the numbered caption: bold lead-in, then the sentence
    const cy = fy + fh + 54 * s;
    const lead = d.text("cap_label", L, cy, 17 * s, { role: "ink", family: "sans", weight: 700, box: tbox(L, cy, 17 * s, 90 * s) });
    const cxs = L + lead.width + 10 * s;
    d.text("caption", cxs, cy, 17 * s, { role: "text", family: "sans", weight: 400, lineHeight: 1.5, box: tbox(cxs, cy, 17 * s, L + fw - cxs, { lines: 2, lh: 1.5 }) });
    // the margin note: a thumbnail, a mauve kicker and small mute text in the right gutter
    const gx = 1180 * s; const gw = 324 * s; const gy = 170 * s;
    d.raw(`<g data-deco="1"><rect x="${f1(gx)}" y="${f1(gy)}" width="${f1(60 * s)}" height="${f1(76 * s)}" rx="${f1(4 * s)}" fill="${d.pal.node}" stroke="${d.pal.stone}" stroke-width="${f1(2 * s)}"/><rect x="${f1(gx + 22 * s)}" y="${f1(gy + 10 * s)}" width="${f1(5 * s)}" height="${f1(56 * s)}" rx="${f1(2.5 * s)}" fill="${d.pal.tile}"/><path d="M${f1(gx + 27 * s)} ${f1(gy + 24 * s)}H${f1(gx + 46 * s)}M${f1(gx + 27 * s)} ${f1(gy + 46 * s)}H${f1(gx + 46 * s)}" stroke="${d.pal.mauve}" stroke-width="${f1(2 * s)}" stroke-linecap="round"/></g>`);
    d.text("margin_label", gx + 78 * s, gy + 30 * s, 16 * s, { role: "ink", family: "sans", weight: 600, box: tbox(gx + 78 * s, gy + 30 * s, 16 * s, gw - 78 * s) });
    d.text("margin_text", gx, gy + 112 * s, 17 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.55, box: tbox(gx, gy + 112 * s, 17 * s, gw, { lines: 5, lh: 1.55 }) });
    d.zone("figure", "safe", [L, fy, fw, fh + 100 * s], { slots: ["fig_title", "stream_label", "cap_label", "caption"] });
  },

  // ---- feature browser: token strips with activation highlights and a top-activations list: 1600 x 900 ---------
  "card.circuits-features"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s; const pw = 1408 * s; const py = 96 * s; const ph = 650 * s;
    panel(d, L, py, pw, ph, s);
    d.text("feat_id", L + 36 * s, py + 62 * s, 26 * s, { role: "ink", family: "sans", weight: 700, box: tbox(L + 36 * s, py + 62 * s, 26 * s, 260 * s) });
    d.text("feat_name", L + 36 * s + 250 * s, py + 62 * s, 22 * s, { role: "text", family: "sans", weight: 400, box: tbox(L + 36 * s + 250 * s, py + 62 * s, 22 * s, 760 * s) });
    hair(d, L, py + 94 * s, pw, s);
    // examples
    const ex = L + 36 * s; const exW = 880 * s; const rows = Math.round(p.rows); const rnd = mulberry(Math.round(p.seed));
    d.text("ex_label", ex, py + 142 * s, 17 * s, { role: "mute", family: "sans", weight: 600, box: tbox(ex, py + 142 * s, 17 * s, 400 * s) });
    const rowH = 62 * s; const rowGap = 16 * s; const ry0 = py + 168 * s;
    const lastPeak = [];
    for (let r = 1; r <= rows; r += 1) {
      const { text } = d.value(`ex_${r}`);
      const n = String(text).trim().split(/\s+/).filter(Boolean).length;
      const peak = Math.floor(rnd() * n); const strength = 0.62 + rnd() * 0.38; lastPeak.push(strength);
      const acts = Array.from({ length: n }, (_, i) => (i === peak ? strength : Math.abs(i - peak) === 1 && rnd() < 0.55 ? strength * (0.35 + rnd() * 0.3) : rnd() < 0.12 ? 0.2 : 0));
      tokenRow(d, `ex_${r}`, ex, ry0 + (r - 1) * (rowH + rowGap), exW, rowH, 24 * s, acts, s);
    }
    // top activations: label, bar on a track, derived value
    const tx = L + 36 * s + exW + 70 * s; const tl = pw - (tx - L) - 36 * s;
    d.text("top_label", tx, py + 142 * s, 17 * s, { role: "mute", family: "sans", weight: 600, box: tbox(tx, py + 142 * s, 17 * s, tl) });
    const rank = Array.from({ length: 5 }, (_, i) => Math.max(0.05, 1 - i * 0.11 - rnd() * 0.06));
    const bars = []; const tracks = [];
    rank.forEach((v, i) => {
      const y = ry0 + i * 76 * s; const bw = tl - 70 * s;
      const role = v >= 0.66 ? "hot_hi" : v >= 0.33 ? "hot_mid" : "hot_lo";
      tracks.push(`<rect x="${f1(tx)}" y="${f1(y + 32 * s)}" width="${f1(bw)}" height="${f1(14 * s)}" rx="${f1(3 * s)}" fill="${d.pal.node}" stroke="${d.pal.stone}" stroke-width="${f1(Math.max(1, s))}" data-role="node"/>`);
      bars.push(`<rect x="${f1(tx)}" y="${f1(y + 32 * s)}" width="${f1(v * bw)}" height="${f1(14 * s)}" rx="${f1(3 * s)}" fill="${d.pal[role]}" data-role="${role}"/>`);
      mono(d, `top_${i + 1}`, tx, y + 20 * s, 20 * s, { role: "ink" });
      d.text(`val_${i + 1}`, tx + tl, y + 20 * s, 18 * s, { role: "text", family: "sans", weight: 500, anchor: "end", content: v.toFixed(2), box: tbox(tx + tl, y + 20 * s, 18 * s, 70 * s, { anchor: "end" }) });
    });
    d.raw(tracks.join("") + bars.join(""));
    // the activation ramp legend and the numbered caption
    const ly = py + ph - 34 * s; let lx = ex;
    [["legend_lo", "hot_lo"], ["legend_hi", "hot_hi"]].forEach(([name, role], i) => {
      d.raw(`<rect x="${f1(lx)}" y="${f1(ly - 14 * s)}" width="${f1(46 * s)}" height="${f1(18 * s)}" rx="${f1(3 * s)}" fill="${d.pal[role]}" data-role="${role}"/>`);
      const w = d.text(name, lx + 58 * s, ly, 16 * s, { role: "mute", family: "sans", weight: 400, box: tbox(lx + 58 * s, ly, 16 * s, 160 * s) }).width;
      lx += 58 * s + Math.max(w, 90 * s) + 40 * s;
    });
    const cy = py + ph + 52 * s;
    const lead = d.text("cap_label", L, cy, 17 * s, { role: "ink", family: "sans", weight: 700, box: tbox(L, cy, 17 * s, 90 * s) });
    const cxs = L + lead.width + 10 * s;
    d.text("caption", cxs, cy, 17 * s, { role: "text", family: "sans", weight: 400, lineHeight: 1.5, box: tbox(cxs, cy, 17 * s, L + pw - cxs, { lines: 2, lh: 1.5 }) });
    d.zone("panel", "safe", [L, py, pw, ph], { slots: ["feat_id", "feat_name", "ex_label", "top_label"] });
  },

  // ---- attribution graph: nodes in layers over tokens, weighted edges: 1600 x 900 -----------------------------
  "card.circuits-graph"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s; const gw = 960 * s; const gx = L + 96 * s; const gTop = 168 * s; const gBot = 656 * s;
    const layers = Math.round(p.layers); const cols = Math.round(p.cols); const per = 4;
    const rnd = mulberry(Math.round(p.seed));
    d.text("fig_title", L, 100 * s, 22 * s, { role: "ink", family: "sans", weight: 700, box: tbox(L, 100 * s, 22 * s, 1000 * s) });
    // layer rows, bottom up; labels at the left
    const rowY = (l) => gBot - 52 * s - (l + 0.5) * ((gBot - 52 * s - gTop - 28 * s) / layers);
    const cell = (gw - 96 * s) / cols; const colX = (c) => gx + cell * (c + 0.5);
    const nodes = []; const R = 11 * s; const stepK = 36 * s;
    for (let l = 0; l < layers; l += 1) {
      for (let c = 0; c < cols; c += 1) {
        for (let k = 0; k < per; k += 1) {
          const active = rnd() < 0.42 + (l === layers - 1 ? 0.12 : 0);
          nodes.push({ l, c, k, active, x: colX(c) + (k - (per - 1) / 2) * stepK, y: rowY(l) });
        }
      }
    }
    // the output node: top right
    const out = { x: colX(cols - 1), y: gTop + 6 * s };
    let edges = ""; let strong = "";
    const byLayer = (l) => nodes.filter((n) => n.l === l && n.active);
    for (let l = 0; l < layers; l += 1) {
      const src = byLayer(l);
      const dst = l === layers - 1 ? [out] : byLayer(l + 1);
      src.forEach((a) => {
        const pool = dst.filter((b) => (b.c === undefined ? true : b.c >= a.c));
        const picks = pool.length ? [pool[Math.floor(rnd() * pool.length)]] : [];
        if (pool.length > 1 && rnd() < 0.5) picks.push(pool[Math.floor(rnd() * pool.length)]);
        picks.forEach((b) => {
          const w = 0.2 + rnd() * 0.8; const top = b === out ? out.y + 26 * s : b.y + R;
          const path = `<path d="${edge(a.x, a.y - R, b.x, top)}" fill="none" stroke="${w > 0.78 ? d.pal.maroon : d.pal.mauve}" stroke-width="${f1((1.2 + w * 3.4) * s)}" stroke-linecap="round" opacity="${(0.35 + w * 0.5).toFixed(2)}"/>`;
          if (w > 0.78) strong += path; else edges += path;
        });
      });
    }
    // token to first-layer edges, thin and grey
    let base = "";
    for (let c = 0; c < cols; c += 1) {
      byLayer(0).filter((n) => n.c === c).forEach((n) => { base += `<path d="${edge(colX(c), gBot - 8 * s, n.x, n.y + R)}" fill="none" stroke="${d.pal.stone}" stroke-width="${f1(1 * s)}" opacity=".7"/>`; });
    }
    d.raw(`<g data-deco="1">${base}${edges}${strong}</g>`);
    // nodes: open beige circles; active ones filled maroon with a lavender ring on the strongest layer's first
    let dots = "";
    nodes.forEach((n) => {
      dots += n.active
        ? `<circle cx="${f1(n.x)}" cy="${f1(n.y)}" r="${f1(R)}" fill="${d.pal.maroon}" stroke="${d.pal.maroon}" stroke-width="${f1(2 * s)}" data-role="maroon"/>`
        : `<circle cx="${f1(n.x)}" cy="${f1(n.y)}" r="${f1(R)}" fill="${d.pal.node}" stroke="${d.pal.stone}" stroke-width="${f1(2 * s)}" data-role="node"/>`;
    });
    // the error nodes (diamonds, as in the legend): one per token and layer, left of the feature nodes
    let errs = "";
    for (let l = 0; l < layers; l += 1) for (let c = 0; c < cols; c += 1) { const ex = colX(c) - 2.35 * stepK; const ey = rowY(l); errs += `<path d="M${f1(ex)} ${f1(ey - 9 * s)}l${f1(9 * s)} ${f1(9 * s)}l${f1(-9 * s)} ${f1(9 * s)}l${f1(-9 * s)} ${f1(-9 * s)}z" fill="${d.pal.maroon}" opacity=".55" data-role="maroon"/>`; }
    d.raw(`<g data-deco="1">${dots}${errs}</g>`);
    for (let l = 0; l < layers; l += 1) d.text(`layer_${l + 1}`, L, rowY(l) + 6 * s, 16 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, rowY(l) + 6 * s, 16 * s, 90 * s) });
    // tokens at the bottom, output at the top right
    for (let c = 0; c < cols; c += 1) {
      const tileW = Math.min(cell - 14 * s, 190 * s);
      d.raw(`<rect x="${f1(colX(c) - tileW / 2)}" y="${f1(gBot - 6 * s)}" width="${f1(tileW)}" height="${f1(46 * s)}" rx="${f1(3 * s)}" fill="${d.pal.tile}" data-role="tile"/>`);
      mono(d, `tok_${c + 1}`, colX(c), gBot + 26 * s, 20 * s, { anchor: "middle", role: "ink" });
    }
    const outW = 140 * s;
    d.raw(`<rect x="${f1(out.x - outW / 2)}" y="${f1(out.y - 20 * s)}" width="${f1(outW)}" height="${f1(46 * s)}" rx="${f1(3 * s)}" fill="${d.pal.tile}" data-role="tile"/>`);
    mono(d, "output", out.x, out.y + 12 * s, 20 * s, { anchor: "middle", role: "ink" });
    // the legend on the right
    const lx = 1180 * s; const lw = 324 * s;
    d.raw(`<g data-deco="1"><path d="M${f1(lx + 12 * s)} ${f1(214 * s)}l${f1(11 * s)} ${f1(11 * s)}l${f1(-11 * s)} ${f1(11 * s)}l${f1(-11 * s)} ${f1(-11 * s)}z" fill="${d.pal.maroon}" data-role="maroon"/><path d="M${f1(lx)} ${f1(404 * s)}h${f1(46 * s)}" stroke="${d.pal.mauve}" stroke-width="${f1(4 * s)}" stroke-linecap="round" opacity=".8"/></g>`);
    d.text("legend_title_1", lx + 40 * s, 230 * s, 18 * s, { role: "ink", family: "sans", weight: 600, box: tbox(lx + 40 * s, 230 * s, 18 * s, lw - 40 * s) });
    d.text("legend_text_1", lx + 40 * s, 262 * s, 16 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.5, box: tbox(lx + 40 * s, 262 * s, 16 * s, lw - 52 * s, { lines: 4, lh: 1.5 }) });
    d.text("legend_title_2", lx + 62 * s, 410 * s, 18 * s, { role: "ink", family: "sans", weight: 600, box: tbox(lx + 62 * s, 410 * s, 18 * s, lw - 62 * s) });
    d.text("legend_text_2", lx + 62 * s, 442 * s, 16 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.5, box: tbox(lx + 62 * s, 442 * s, 16 * s, lw - 74 * s, { lines: 4, lh: 1.5 }) });
    const cy = 758 * s;
    const lead = d.text("cap_label", L, cy, 17 * s, { role: "ink", family: "sans", weight: 700, box: tbox(L, cy, 17 * s, 90 * s) });
    const cxs = L + lead.width + 10 * s;
    d.text("caption", cxs, cy, 17 * s, { role: "text", family: "sans", weight: 400, lineHeight: 1.5, box: tbox(cxs, cy, 17 * s, 1408 * s - lead.width - 10 * s, { lines: 2, lh: 1.5 }) });
  },

  // ---- sticky table of contents beside an article column with a footnote preview: 1600 x 900 ------------------
  "doc.circuits-contents"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    const L = 96 * s; const tocW = 420 * s; const top = 124 * s;
    const NEST = [0, 0, 0, 1, 1, 0, 0, 0];
    const n = Math.round(p.count); const active = Math.min(n - 1, Math.round(p.active));
    d.text("toc_title", L, top + 18 * s, 28 * s, { role: "ink", family: "sans", weight: 700, box: tbox(L, top + 18 * s, 28 * s, tocW) });
    for (let i = 0; i < n; i += 1) {
      const y = top + 84 * s + i * 44 * s; const nest = NEST[i];
      const isActive = i === active;
      if (isActive) d.raw(`<rect x="${f1(L - 14 * s)}" y="${f1(y - 21 * s)}" width="${f1(3 * s)}" height="${f1(28 * s)}" rx="${f1(1.5 * s)}" fill="${d.pal.maroon}" data-role="maroon"/>`);
      d.text(`toc_${i + 1}`, L + nest * 22 * s, y, 18 * s, { role: isActive ? "ink" : nest ? "mute" : "text", family: "sans", weight: isActive || !nest ? 600 : 400, box: tbox(L + nest * 22 * s, y, 18 * s, tocW - nest * 22 * s - 24 * s) });
    }
    d.rect(L + tocW, top - 10 * s, Math.max(1, s), 560 * s, "rule");
    // the article column
    const ax = 640 * s; const aw = 780 * s;
    d.text("kicker", ax, top + 16 * s, 16 * s, { role: "mute", family: "sans", weight: 600, tracking: 90, box: tbox(ax, top + 16 * s, 16 * s, 400 * s) });
    d.text("heading", ax, top + 80 * s, 44 * s, { role: "text", family: "sans", weight: 600, box: tbox(ax, top + 80 * s, 44 * s, aw) });
    d.text("para", ax, top + 150 * s, 20 * s, { role: "text", family: "sans", weight: 400, lineHeight: 1.7, box: tbox(ax, top + 150 * s, 20 * s, aw, { lines: 4, lh: 1.7 }) });
    // a footnote preview card hovering under the paragraph
    const cx = ax + 34 * s; const cw = aw - 34 * s; const cy = top + 320 * s; const ch = 150 * s;
    d.raw(`<rect x="${f1(cx)}" y="${f1(cy)}" width="${f1(cw)}" height="${f1(ch)}" rx="${f1(6 * s)}" fill="${d.pal.node}" stroke="${d.pal.rule}" stroke-width="${f1(Math.max(1, s))}" data-role="node"/>`);
    d.text("fn_label", cx + 24 * s, cy + 40 * s, 16 * s, { role: "link", family: "sans", weight: 700, box: tbox(cx + 24 * s, cy + 40 * s, 16 * s, 300 * s) });
    d.text("fn_text", cx + 24 * s, cy + 74 * s, 17 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.55, box: tbox(cx + 24 * s, cy + 74 * s, 17 * s, cw - 48 * s, { lines: 3, lh: 1.55 }) });
    d.zone("article", "safe", [ax, top, aw, 520 * s], { slots: ["kicker", "heading", "para", "fn_label", "fn_text"] });
  },
};

module.exports = { LAYOUTS };
