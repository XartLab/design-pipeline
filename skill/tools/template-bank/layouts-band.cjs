"use strict";

// Layouts of the brand-band style pack (styles/brand-band/style.json): the grammar of an AI-lab corporate site,
// measured privately in Chrome on the public pages the owner named (never shipped): an ivory page that runs
// into an oat band and a near-black band, an editorial serif for statements against a bold grotesque for
// titles and a regular one for labels, square colour fields that carry one small hand-drawn picture, 16 unit
// cards on paper, black 10 unit buttons, full-radius nav pills. The pictures are our own: eight code-drawn
// subjects (illustrations-band.cjs) drawn as marker ribbons through a crayon line filter on flat fields.
// Geometry in a 1600-unit canvas (the social card 1200) scaled to the size. Faces are named, never bundled.

const { f1 } = require("./layout-kit.cjs");
const measure = require("./measure.cjs");
const ill = require("./illustrations-band.cjs");

const FIELDS = ["sage", "blush", "lilac", "sky", "sand"];

function tbox(x, y, size, w, { lines = 1, lh = 1.3, anchor = "start" } = {}) {
  const x0 = anchor === "start" ? x : anchor === "middle" ? x - w / 2 : x - w;
  return [x0 - 2, y - 0.88 * size - 2, w + 4, size * (1 + (lines - 1) * lh) + 4];
}
const tw = (text, size, weight = 400, serif = false) => measure.textWidth(text, size, 0, { serif, weight });
// How many lines a slot's text wraps to at a width, so what follows a headline can sit under its last line.
const rows = (d, name, size, width, weight, serif, max) => Math.min(max, Math.max(1, measure.wrapText(d.value(name).text, size, width, 0, { serif, weight }).length));

// The marker line: a finer wobble and a paper-tooth mask over every stroke of a picture. Units are the
// picture's own 400-unit box, so the grain scales with the tile.
function lineFilter(d) {
  if (d.bandLine) return;
  d.bandLine = true;
  d.def("<filter id=\"band-line\" x=\"-40%\" y=\"-40%\" width=\"180%\" height=\"180%\"><feTurbulence type=\"fractalNoise\" baseFrequency=\".06\" numOctaves=\"2\" seed=\"2\" result=\"w\"/><feDisplacementMap in=\"SourceGraphic\" in2=\"w\" scale=\"2\" result=\"d\"/><feTurbulence type=\"fractalNoise\" baseFrequency=\".9\" numOctaves=\"1\" seed=\"8\" result=\"t\"/><feColorMatrix in=\"t\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.6 0 0 0 1.95\" result=\"m\"/><feComposite in=\"d\" in2=\"m\" operator=\"in\"/></filter>");
}

// A square (or any rectangle) colour field with one picture centred in it: the field is a plain rect the
// check can measure; the picture is decoration (its paths and filter are never measured as text ground).
function tile(d, x, y, w, h, field, subject, size) {
  lineFilter(d);
  const id = ill.IDS[((Math.round(subject) % ill.IDS.length) + ill.IDS.length) % ill.IDS.length];
  d.rect(x, y, w, h, field);
  const k = size / 400; const ox = x + (w - size) / 2; const oy = y + (h - size) / 2;
  // the subject's flat accent follows the field: never the field's own hue
  const accents = { accent: field === "olive" ? "clay" : "olive", accent2: field === "sky" ? "clay" : "sky" };
  d.raw(`<g data-deco="1" transform="translate(${f1(ox)} ${f1(oy)}) scale(${k.toFixed(4)})">${ill.svgBody(id, { ink: d.pal.ink, paint: { paper: d.pal.ivory, clay: d.pal.clay, olive: d.pal.olive, sky: d.pal.sky }, accents, strokeAttrs: " filter=\"url(#band-line)\"" })}</g>`);
  return id;
}

// Pill: a full-radius nav pill (paper, hairline), a 10 unit solid button (ink on light grounds, ivory on night)
// or a ghost button (a flat grey fill), width follows the label.
function pill(d, name, x, y, s, { kind = "nav", h, size, minW = 0, ground = "ivory" } = {}) {
  const { text } = d.value(name);
  const nav = kind === "nav"; const fs = (size || (nav ? 15 : 17)) * s; const hh = (h || (nav ? 34 : 52)) * s;
  const w = Math.max(minW * s, tw(text, fs, nav ? 400 : 500) + (nav ? 34 : 52) * s);
  const dark = ground === "night";
  const role = kind === "solid" ? (dark ? "ivory" : "ink") : kind === "ghost" ? (dark ? "coal" : "wash") : "paper";
  const rx = nav ? hh / 2 : 10 * s;
  d.raw(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(hh)}" rx="${f1(rx)}" fill="${d.pal[role]}"${nav ? ` stroke="${d.pal.stone}" stroke-width="1"` : ""} data-role="${role}"/>`);
  const ink = kind === "solid" ? (dark ? "ink" : "ivory") : nav ? "body" : (dark ? "ivory" : "ink");
  d.text(name, x + w / 2, y + hh / 2 + 0.36 * fs, fs, { role: ink, family: "sans", weight: nav ? 400 : 500, anchor: "middle", box: [x + 6 * s, y + 3 * s, w - 12 * s, hh - 6 * s] });
  return w;
}

const LAYOUTS = {
  // ---- hero band: nav, serif headline, deck, buttons, a square field with one picture; an oat strip: 1600 x 900 ----
  "kv.band-hero"(d) {
    const { W, H, p } = d; const s = W / 1600;
    d.rect(0, 0, W, H, "ivory");
    const L = 80 * s; const ny = 28 * s;
    let x = L;
    ["nav_1", "nav_2", "nav_3"].forEach((name) => { x += pill(d, name, x, ny, s) + 8 * s; });
    d.text("brand", W / 2, ny + 25 * s, 24 * s, { role: "ink", family: "sans", weight: 700, tracking: 120, anchor: "middle", box: tbox(W / 2, ny + 25 * s, 24 * s, 320 * s, { anchor: "middle" }) });
    const wc = tw(d.value("nav_cta").text, 15 * s, 400) + 34 * s;
    pill(d, "nav_cta", W - L - wc, ny, s);
    const ts = 78 * s; const colW = 700 * s;
    d.text("title_1", L, 330 * s, ts, { role: "ink", family: "serif", weight: 400, box: tbox(L, 330 * s, ts, colW) });
    d.text("title_2", L, 424 * s, ts, { role: "ink", family: "serif", weight: 400, box: tbox(L, 424 * s, ts, colW) });
    d.text("deck", L, 504 * s, 20 * s, { role: "body", family: "sans", weight: 400, lineHeight: 1.6, box: tbox(L, 504 * s, 20 * s, 600 * s, { lines: 2, lh: 1.6 }) });
    const w1 = pill(d, "cta_1", L, 590 * s, s, { kind: "solid", minW: 150 });
    pill(d, "cta_2", L + w1 + 12 * s, 590 * s, s, { kind: "ghost", minW: 150 });
    d.text("meta", L, 690 * s, 14 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 690 * s, 14 * s, 560 * s) });
    const size = 560 * p.tile * s; const tx = W - L - size; const ty = 160 * s + (560 * s - size) / 2;
    tile(d, tx, ty, size, size, p.field, p.subject, size * 0.82);
    // the oat strip: the second band, three one-line labels with a small clay dot each
    d.rect(0, 800 * s, W, 100 * s, "oat");
    const step = (W - 2 * L) / 3;
    ["strip_1", "strip_2", "strip_3"].forEach((name, i) => {
      const sx = L + i * step;
      d.raw(`<circle cx="${f1(sx + 6 * s)}" cy="${f1(850 * s)}" r="${f1(5 * s)}" fill="${d.pal.clay}" data-role="clay"/>`);
      d.text(name, sx + 24 * s, 856 * s, 16 * s, { role: "ink", family: "sans", weight: 500, box: tbox(sx + 24 * s, 856 * s, 16 * s, step - 48 * s) });
    });
    d.zone("copy", "safe", [0, 0, W * 0.56, 800 * s], { slots: ["title_1", "title_2", "deck", "cta_1", "cta_2", "meta"] });
  },

  // ---- three feature cards, each a picture on a field, a bold title, one sentence, a link: 1600 x 900 -----------
  "card.band-features"(d) {
    const { W, H, p } = d; const s = W / 1600;
    d.rect(0, 0, W, H, "ivory");
    const L = 80 * s; const gap = 24 * s; const cw = (W - 2 * L - 2 * gap) / 3; const pad = 32 * s;
    d.text("heading", L, 104 * s, 46 * s, { role: "ink", family: "serif", weight: 400, box: tbox(L, 104 * s, 46 * s, 1400 * s) });
    d.text("lede", L, 154 * s, 18 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 154 * s, 18 * s, 1100 * s) });
    const cy = 200 * s; const ch = 620 * s;
    [1, 2, 3].forEach((i, k) => {
      const x = L + k * (cw + gap); const inner = cw - 2 * pad;
      d.raw(`<rect x="${f1(x)}" y="${f1(cy)}" width="${f1(cw)}" height="${f1(ch)}" rx="${f1(16 * s)}" fill="${d.pal.paper}" data-role="paper"/>`);
      tile(d, x + pad, cy + pad, inner, inner, FIELDS[(Math.round(p.field_start) + k) % FIELDS.length], Math.round(p.subject_start) + k, inner * 0.8);
      const ty = cy + pad + inner + 56 * s;
      d.text(`title_${i}`, x + pad, ty, 24 * s, { role: "ink", family: "sans", weight: 700, box: tbox(x + pad, ty, 24 * s, inner) });
      d.text(`text_${i}`, x + pad, ty + 40 * s, 16 * s, { role: "body", family: "sans", weight: 400, lineHeight: 1.6, box: tbox(x + pad, ty + 40 * s, 16 * s, inner, { lines: 2, lh: 1.6 }) });
      const ly = cy + ch - 28 * s;
      d.text(`link_${i}`, x + pad, ly, 16 * s, { role: "ink", family: "sans", weight: 500, box: tbox(x + pad, ly, 16 * s, inner) });
    });
  },

  // ---- black band: a label, a big serif statement, two buttons, a hairline footer row: 1600 x 900 -----------------
  "banner.band-black-statement"(d) {
    const { W, H, p } = d; const s = W / 1600;
    d.rect(0, 0, W, H, "night");
    const L = 120 * s; const cw = (p.show_tile ? 960 : 1360) * s;
    d.text("label", L, 150 * s, 14 * s, { role: "dim", family: "sans", weight: 700, tracking: 130, box: tbox(L, 150 * s, 14 * s, 480 * s) });
    const qs = 68 * s;
    d.text("statement", L, 270 * s, qs, { role: "ivory", family: "serif", weight: 400, lineHeight: 1.22, box: tbox(L, 270 * s, qs, cw, { lines: 3, lh: 1.22 }) });
    const by = 270 * s + (rows(d, "statement", qs, cw, 400, true, 3) - 1) * qs * 1.22 + 110 * s;
    const w1 = pill(d, "cta_1", L, by, s, { kind: "solid", minW: 160, ground: "night" });
    pill(d, "cta_2", L + w1 + 12 * s, by, s, { kind: "ghost", minW: 160, ground: "night" });
    if (p.show_tile) tile(d, 1160 * s, 130 * s, 320 * s, 320 * s, p.field, p.subject, 270 * s);
    d.rect(L, 758 * s, W - 2 * L, 1, "coal");
    const step = (W - 2 * L) / 3;
    ["foot_1", "foot_2", "foot_3"].forEach((name, i) => {
      const fx = L + i * step;
      d.text(name, fx, 810 * s, 14 * s, { role: "dim", family: "sans", weight: 400, box: tbox(fx, 810 * s, 14 * s, step - 40 * s) });
    });
    d.zone("copy", "safe", [0, 0, (p.show_tile ? 1120 : 1480) * s, H], { slots: ["label", "statement", "cta_1", "cta_2"] });
  },

  // ---- article cover: a full-height square field with one picture, category, bold title, deck, byline: 1600 x 900 ----
  "cover.band-article"(d) {
    const { W, H, p } = d; const s = W / 1600;
    d.rect(0, 0, W, H, "ivory");
    tile(d, 0, 0, H, H, p.field, p.subject, H * 0.7);
    const L = 980 * s; const cw = 540 * s;
    const cat = d.text("category", L, 150 * s, 14 * s, { role: "ink", family: "sans", weight: 700, tracking: 20, box: tbox(L, 150 * s, 14 * s, 240 * s) });
    d.text("date", L + cat.width + 20 * s, 150 * s, 14 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L + cat.width + 20 * s, 150 * s, 14 * s, 240 * s) });
    const ts = 54 * s;
    d.text("title", L, 262 * s, ts, { role: "ink", family: "sans", weight: 700, lineHeight: 1.18, box: tbox(L, 262 * s, ts, cw, { lines: 3, lh: 1.18 }) });
    const dy = 262 * s + (rows(d, "title", ts, cw, 700, false, 3) - 1) * ts * 1.18 + 96 * s;
    d.text("deck", L, dy, 22 * s, { role: "body", family: "serif", weight: 400, lineHeight: 1.5, box: tbox(L, dy, 22 * s, cw, { lines: 3, lh: 1.5 }) });
    d.rect(L, 738 * s, cw, 1, "stone");
    d.text("byline", L, 784 * s, 15 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 784 * s, 15 * s, cw) });
    d.zone("copy", "safe", [H, 0, W - H, H], { slots: ["category", "date", "title", "deck", "byline"] });
  },

  // ---- social card: ivory left with a serif headline, a field with one picture right: 1200 x 630 -----------------
  "card.band-social"(d) {
    const { W, H, p } = d; const s = W / 1200;
    d.rect(0, 0, W, H, "ivory");
    const fx = 640 * s;
    tile(d, fx, 0, W - fx, H, p.field, p.subject, 450 * s);
    const L = 64 * s;
    d.text("brand", L, 84 * s, 18 * s, { role: "ink", family: "sans", weight: 700, tracking: 120, box: tbox(L, 84 * s, 18 * s, 360 * s) });
    const ts = 58 * s;
    d.text("title", L, 236 * s, ts, { role: "ink", family: "serif", weight: 400, lineHeight: 1.16, box: tbox(L, 236 * s, ts, 540 * s, { lines: 3, lh: 1.16 }) });
    const sy = 236 * s + (rows(d, "title", ts, 540 * s, 400, true, 3) - 1) * ts * 1.16 + 84 * s;
    d.text("sub", L, sy, 19 * s, { role: "body", family: "sans", weight: 400, lineHeight: 1.55, box: tbox(L, sy, 19 * s, 520 * s, { lines: 2, lh: 1.55 }) });
    pill(d, "tag", L, Math.max(sy + 70 * s, 500 * s), s, { kind: "solid", h: 44, size: 16, minW: 120 });
    d.zone("copy", "safe", [0, 0, fx, H], { slots: ["brand", "title", "sub", "tag"] });
  },

  // ---- pill and CTA row on an oat band: heading, filter pills, two buttons, a note: 1600 x 600 ----------------------
  "banner.band-cta-row"(d) {
    const { W, H } = d; const s = W / 1600;
    d.rect(0, 0, W, H, "oat");
    d.text("heading", W / 2, 150 * s, 52 * s, { role: "ink", family: "serif", weight: 400, anchor: "middle", box: tbox(W / 2, 150 * s, 52 * s, 1200 * s, { anchor: "middle" }) });
    d.text("lede", W / 2, 206 * s, 19 * s, { role: "body", family: "sans", weight: 400, anchor: "middle", box: tbox(W / 2, 206 * s, 19 * s, 1000 * s, { anchor: "middle" }) });
    const names = ["pill_1", "pill_2", "pill_3", "pill_4"]; const gap = 8 * s;
    const widths = names.map((n) => tw(d.value(n).text, 15 * s, 400) + 34 * s);
    let x = W / 2 - (widths.reduce((a, b) => a + b, 0) + gap * 3) / 2;
    names.forEach((n, i) => { pill(d, n, x, 262 * s, s); x += widths[i] + gap; });
    const wa = Math.max(170 * s, tw(d.value("cta_1").text, 17 * s, 500) + 52 * s); const wb = Math.max(170 * s, tw(d.value("cta_2").text, 17 * s, 500) + 52 * s);
    const bx = W / 2 - (wa + wb + 12 * s) / 2;
    pill(d, "cta_1", bx, 350 * s, s, { kind: "solid", minW: 170 });
    pill(d, "cta_2", bx + wa + 12 * s, 350 * s, s, { kind: "ghost", minW: 170 });
    d.text("note", W / 2, 470 * s, 14 * s, { role: "mute", family: "sans", weight: 400, anchor: "middle", box: tbox(W / 2, 470 * s, 14 * s, 1000 * s, { anchor: "middle" }) });
  },
};

module.exports = { LAYOUTS, FIELDS };
