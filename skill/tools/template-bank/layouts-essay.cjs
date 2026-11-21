"use strict";

// Layouts of the institute-essay style pack (styles/institute-essay/style.json): the grammar of an AI
// research institute's long-form explainer and research-essay pages, measured in Chrome on two public
// reference pages the owner named (kept private, never shipped). An ivory page, one clay accent, a book
// serif for display and body against a neutral grotesque for every label, figures on 22-unit graph paper
// with crayon-textured bars, a sticky note card riding on a figure, scenario cards, a big pull quote
// and a seeded pixel burst as the hero picture. Geometry in a 1600-unit canvas scaled to the size.
// Everything is drawn here; the faces are named (Source Serif 4, Inter, Noto), never bundled.

const { f1, esc } = require("./layout-kit.cjs");
const measure = require("./measure.cjs");

const GRID = 22; // graph paper pitch, units
const DATA = ["purple", "blue", "amber"]; // the three scenario hues, used only inside figures
// The dark theme: the measured ground #141413 with the page's own light-on-dark counterparts.
const DARK = { ivory: "#141413", ink: "#F0EEE6", mute: "#A8A69C", faint: "#7A786F", line: "#34332F", grid: "#232220", paper: "#1F1E1C", tile: "#4A4842", stone: "#4A4842" };

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
const tw = (text, size, weight = 400, serif = false) => measure.textWidth(text, size, 0, { serif, weight });

function begin(d) {
  if (d.p.theme === "dark") Object.assign(d.pal, DARK);
  d.rect(0, 0, d.W, d.H, "ivory");
}

// The crayon fill for bars, tiles, swatches and the burst: a low-frequency displacement wobbles the edge
// like a hand-pushed stick, a streak noise stretched along x (baseFrequency .025 .55) multiplied with a fine
// paper-tooth noise becomes the alpha of the fill, so the colour breaks into waxy streaks with the paper
// showing through. Frequencies are per unit, so they are divided by the scale and a size keeps the look. The
// shapes under it are plain rects, so the static check measures geometry and never the filter.
function crayon(d, s) {
  if (d.essayCrayon) return;
  d.essayCrayon = true;
  const q = (v) => (v / s).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  d.def(`<filter id="essay-crayon" x="-6%" y="-12%" width="112%" height="124%"><feTurbulence type="fractalNoise" baseFrequency="${q(0.04)}" numOctaves="2" seed="7" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="${f1(4 * s)}" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="${q(0.025)} ${q(0.55)}" numOctaves="2" seed="3" result="s"/><feTurbulence type="fractalNoise" baseFrequency="${q(1.1)}" numOctaves="1" seed="12" result="t"/><feComposite in="s" in2="t" operator="arithmetic" k2=".6" k3=".55" result="st"/><feColorMatrix in="st" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 2.05" result="m"/><feComposite in="d" in2="m" operator="in"/></filter>`);
}

// The crayon line for hand-drawn icons and arrows: a finer wobble and a paper-tooth mask over the stroke.
function crayonLine(d, s) {
  if (d.essayLine) return;
  d.essayLine = true;
  const q = (v) => (v / s).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  d.def(`<filter id="essay-line" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${q(0.06)}" numOctaves="2" seed="2" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="${f1(3.2 * s)}" result="d"/><feTurbulence type="fractalNoise" baseFrequency="${q(0.9)}" numOctaves="1" seed="8" result="t"/><feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2 0 0 0 1.75" result="m"/><feComposite in="d" in2="m" operator="in"/></filter>`);
}

// Hand-drawn line icons, each in a local box about (0, 0) about 84 units wide: strokes only, drawn through
// the crayon line filter. hw is the half width, used to keep arrows clear of the icon.
const ICONS = {
  stack: { hw: 26, d: "M-26 -23a26 9 0 1 0 52 0a26 9 0 1 0 -52 0M-26 -23v38c0 5 12 9 26 9s26-4 26-9V-23M-26 -4c0 5 12 9 26 9s26-4 26-9" },
  laptop: { hw: 42, d: "M-28 -25h56c3 0 4 1 4 4v34h-64V-21c0-3 1-4 4-4zM-42 17h84l-6 9h-72z" },
  fork: { hw: 32, d: "M-32 1h22M-10 1c12 0 14-22 30-22h12M-10 1h42M-10 1c12 0 14 22 30 22h12" },
  page: { hw: 24, d: "M-24 -28h34l14 14v42h-48zM10 -28v14h14M-14 -2h28M-14 8h28M-14 18h18" },
  person: { hw: 28, d: "M-13 -14a13 13 0 1 0 26 0a13 13 0 1 0 -26 0M-27 28c0-16 11-27 27-27s27 11 27 27z" },
};
const ICON_NAMES = Object.keys(ICONS);

// One icon at (cx, cy) scaled by k; stroke 3.2 local units. Decoration: the check never measures it.
function icon(name, cx, cy, k, color) {
  return `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(k)})" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[name].d}"/></g>`;
}

// Graph paper: an ivory ground the static check reads, a 22-unit grid pattern over it (patterns are hidden
// from the static check; the lines are one unit wide and nearly the ground), hairlines above and below.
function paper(d, y, h, s) {
  const g = GRID * s;
  if (!d.essayGrid) {
    d.essayGrid = true;
    d.def(`<pattern id="essay-grid" width="${f1(g)}" height="${f1(g)}" patternUnits="userSpaceOnUse"><path d="M${f1(g)} 0 H0 V${f1(g)}" fill="none" stroke="${d.pal.grid}" stroke-width="1"/></pattern>`);
  }
  d.rect(0, y, d.W, h, "ivory");
  d.raw(`<rect data-deco="1" x="0" y="${f1(y)}" width="${f1(d.W)}" height="${f1(h)}" fill="url(#essay-grid)"/>`);
  d.rect(0, y, d.W, 1, "line");
  d.rect(0, y + h - 1, d.W, 1, "line");
}

// Pill button: 1 px hairline, full radius, sans 500; width follows the label.
function pill(d, name, x, y, s, { h = 48, size = 17, minW = 128 } = {}) {
  const { text } = d.value(name);
  const fs = size * s; const hh = h * s;
  const w = Math.max(minW * s, tw(text, fs, 500) + 52 * s);
  d.raw(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(hh)}" rx="${f1(hh / 2)}" fill="${d.pal.ivory}" stroke="${d.pal.stone}" stroke-width="1" data-role="ivory"/>`);
  d.text(name, x + w / 2, y + hh / 2 + 0.36 * fs, fs, { role: "ink", family: "sans", weight: 500, anchor: "middle", box: [x + 8 * s, y + 4 * s, w - 16 * s, hh - 8 * s] });
  return w;
}

// A legend row of 14-unit squares with sans labels, centred on cx. Slots legend_1..legend_3.
function legend(d, y, cx, s, size = 15) {
  const fs = size * s; const sq = 14 * s; const gap = 30 * s;
  const items = [1, 2, 3].map((i) => ({ name: `legend_${i}`, text: d.value(`legend_${i}`).text }));
  const widths = items.map((it) => sq + 8 * s + tw(it.text, fs, 400) + 6 * s);
  let x = cx - (widths.reduce((a, b) => a + b, 0) + gap * 2) / 2;
  items.forEach((it, i) => {
    d.raw(`<rect x="${f1(x)}" y="${f1(y - sq + 1 * s)}" width="${f1(sq)}" height="${f1(sq)}" rx="${f1(2 * s)}" fill="${d.pal[DATA[i]]}" data-role="${DATA[i]}"/>`);
    d.text(it.name, x + sq + 8 * s, y, fs, { role: "mute", family: "sans", weight: 400, box: tbox(x + sq + 8 * s, y, fs, widths[i] - sq - 8 * s + 2 * s) });
    x += widths[i] + gap;
  });
}

const LAYOUTS = {
  // ---- hero: serif title left, pixel burst right: 1600 x 900 ----------------------------------------
  "cover.essay-hero"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d); crayon(d, s);
    const L = 96 * s; const colW = 740 * s;
    d.text("brand", L, 88 * s, 16 * s, { role: "ink", family: "sans", weight: 700, tracking: 30, box: tbox(L, 88 * s, 16 * s, 520 * s) });
    const ts = 76 * s;
    d.text("title_1", L, 330 * s, ts, { role: "ink", family: "serif", weight: 400, box: tbox(L, 330 * s, ts, colW) });
    d.text("title_2", L, 416 * s, ts, { role: "ink", family: "serif", weight: 400, box: tbox(L, 416 * s, ts, colW) });
    d.text("deck", L, 484 * s, 20 * s, { role: "mute", family: "sans", weight: 400, lineHeight: 1.5, box: tbox(L, 484 * s, 20 * s, 560 * s, { lines: 2, lh: 1.5 }) });
    const w1 = pill(d, "cta_1", L, 572 * s, s);
    pill(d, "cta_2", L + w1 + 12 * s, 572 * s, s);
    d.text("meta", L, 684 * s, 15 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 684 * s, 15 * s, 560 * s) });
    // the burst: a 15 x 15 grid of rounded clay squares kept by a ray-and-noise score, seeded
    const N = 15; const size = 640 * s; const cs = size / N; const x0 = 1180 * s - size / 2; const y0 = 450 * s - size / 2;
    const rnd = mulberry(Math.round(p.seed)); const keep = 0.95 - p.density;
    let squares = "";
    for (let y = 0; y < N; y += 1) {
      for (let x = 0; x < N; x += 1) {
        const dx = x - 7; const dy = y - 7; const r = Math.hypot(dx, dy); const ray = Math.abs(Math.sin(Math.atan2(dy, dx) * 4));
        const score = r < 2.5 ? 1 : (1 - ray) * 1.35 - r / 14 + rnd() * 0.35;
        if (r > 7.5 || score <= keep) continue;
        const o = (0.78 + rnd() * 0.22).toFixed(2); const pad = cs * 0.07;
        squares += `<rect x="${f1(x0 + x * cs + pad)}" y="${f1(y0 + y * cs + pad)}" width="${f1(cs - 2 * pad)}" height="${f1(cs - 2 * pad)}" rx="${f1(cs * 0.12)}" fill="${d.pal.clay}" opacity="${o}" data-role="clay"/>`;
      }
    }
    d.raw(`<g filter="url(#essay-crayon)">${squares}</g>`);
    d.zone("copy", "safe", [0, 0, 840 * s, H], { slots: ["brand", "title_1", "title_2", "deck", "cta_1", "cta_2", "meta"] });
  },

  // ---- finding: label, claim and three crayon bars on graph paper: 1600 x 900 ------------------
  "card.essay-finding"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d); crayon(d, s);
    const L = 120 * s;
    d.text("finding_label", L, 104 * s, 30 * s, { role: "faint", family: "serif", weight: 400, box: tbox(L, 104 * s, 30 * s, 1200 * s) });
    d.text("claim", L, 160 * s, 36 * s, { role: "ink", family: "serif", weight: 400, lineHeight: 1.25, box: tbox(L, 160 * s, 36 * s, 1260 * s, { lines: 2, lh: 1.25 }) });
    paper(d, 262 * s, 548 * s, s);
    d.text("fig_title", W / 2, 304 * s, 15 * s, { role: "ink", family: "sans", weight: 700, anchor: "middle", box: tbox(W / 2, 304 * s, 15 * s, 960 * s, { anchor: "middle" }) });
    // bar rows: label at the left, bar on its track, derived value at the right
    const tx = 400 * s; const tl = 880 * s; const bh = 34 * s; const pitch = 76 * s; const y0 = 346 * s;
    const track = [];
    const bars = [];
    [1, 2, 3].forEach((i, k) => {
      const y = y0 + k * pitch; const v = p[`value_${i}`]; const w = Math.max(0, Math.min(1, v / p.max)) * tl;
      track.push(`<rect x="${f1(tx)}" y="${f1(y)}" width="${f1(tl)}" height="${f1(bh)}" rx="${f1(3 * s)}" fill="${d.pal.tile}" opacity=".3" data-role="tile"/>`);
      bars.push(`<rect x="${f1(tx)}" y="${f1(y)}" width="${f1(w)}" height="${f1(bh)}" rx="${f1(3 * s)}" fill="${d.pal[DATA[k]]}" data-role="${DATA[k]}"/>`);
    });
    d.raw(`<g filter="url(#essay-crayon)">${track.join("")}${bars.join("")}</g>`);
    d.raw(`<rect data-deco="1" x="${f1(tx - 1)}" y="${f1(y0 - 12 * s)}" width="1.5" height="${f1(2 * pitch + bh + 24 * s)}" fill="${d.pal.stone}"/>`);
    [1, 2, 3].forEach((i, k) => {
      const y = y0 + k * pitch; const base = y + bh / 2 + 7 * s;
      d.text(`label_${i}`, 220 * s, base, 20 * s, { role: "ink", family: "serif", weight: 400, box: tbox(220 * s, base, 20 * s, 150 * s) });
      d.text(`value_${i}`, tx + tl + 30 * s, base + 1 * s, 26 * s, { role: "ink", family: "sans", weight: 500, content: `+${Number(p[`value_${i}`])}%`, box: tbox(tx + tl + 30 * s, base + 1 * s, 26 * s, 130 * s) });
    });
    legend(d, 622 * s, W / 2, s);
    d.text("footnote", W / 2, 668 * s, 14 * s, { role: "mute", family: "sans", weight: 400, anchor: "middle", box: tbox(W / 2, 668 * s, 14 * s, 900 * s, { anchor: "middle" }) });
    // "How to read this": a bold italic lead-in, then the sentence, on one line in the 640-unit column
    const hx = 480 * s; const hy = 744 * s; const lead = d.text("howto_label", hx, hy, 16 * s, { role: "mute", family: "sans", weight: 700, italic: true, box: tbox(hx, hy, 16 * s, 190 * s) });
    const sx = hx + lead.width + 10 * s;
    d.text("howto", sx, hy, 16 * s, { role: "mute", family: "sans", weight: 400, box: tbox(sx, hy, 16 * s, 1180 * s - sx) });
    d.zone("figure", "safe", [0, 262 * s, W, 548 * s], { slots: ["fig_title", "label_1", "label_2", "label_3", "value_1", "value_2", "value_3", "footnote", "howto_label", "howto"] });
  },

  // ---- graph-paper figure with a sticky note: 1600 x 900 ---------------------------------------------
  "card.essay-note-figure"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d);
    paper(d, 120 * s, 690 * s, s);
    d.text("fig_title", W / 2, 164 * s, 15 * s, { role: "ink", family: "sans", weight: 700, anchor: "middle", box: tbox(W / 2, 164 * s, 15 * s, 960 * s, { anchor: "middle" }) });
    // plot: dashed fan lines in three hues, one bundle per scenario, a faint guide at 1x and at the top
    const px0 = 520 * s; const px1 = 1480 * s; const py0 = 214 * s; const py1 = 690 * s;
    const growth = [0.04, 0.11, 0.2]; const steps = 10;
    const rnd = mulberry(Math.round(p.seed)); const bundles = growth.map((g) => Array.from({ length: Math.round(p.lines) }, () => {
      const k = 1 + (rnd() - 0.5) * p.spread; let v = 1; const a = [];
      for (let t = 0; t <= steps; t += 1) { a.push(v); v *= 1 + g * k * (t / 6 + 0.4); }
      return a;
    }));
    const top = Math.max(3, Math.ceil(Math.max(...bundles.flat(2))));
    const X = (t) => px0 + (t / steps) * (px1 - px0); const Y = (v) => py1 - ((v - 1) / (top - 1)) * (py1 - py0);
    let guides = ""; let lines = "";
    [1, top].forEach((v) => { guides += `<rect x="${f1(px0)}" y="${f1(Y(v))}" width="${f1(px1 - px0)}" height="1" fill="${d.pal.stone}"/>`; });
    bundles.forEach((bundle, k) => bundle.forEach((a) => {
      lines += `<path d="${a.map((v, t) => `${t ? "L" : "M"}${f1(X(t))} ${f1(Y(v))}`).join(" ")}" fill="none" stroke="${d.pal[DATA[k]]}" stroke-width="${f1(1.8 * s)}" stroke-dasharray="${f1(7 * s)} ${f1(4 * s)}" opacity=".5"/>`;
    }));
    d.raw(`<g data-deco="1">${guides}${lines}</g>`);
    d.text("y_1", px0 - 14 * s, Y(1) + 5 * s, 14 * s, { role: "mute", family: "sans", weight: 400, anchor: "end", content: "1×", box: tbox(px0 - 14 * s, Y(1) + 5 * s, 14 * s, 60 * s, { anchor: "end" }) });
    d.text("y_2", px0 - 14 * s, Y(top) + 5 * s, 14 * s, { role: "mute", family: "sans", weight: 400, anchor: "end", content: `${top}×`, box: tbox(px0 - 14 * s, Y(top) + 5 * s, 14 * s, 60 * s, { anchor: "end" }) });
    [[1, 0], [2, 5], [3, 10]].forEach(([i, t]) => d.text(`x_${i}`, X(t), py1 + 32 * s, 14 * s, { role: "mute", family: "sans", weight: 400, anchor: "middle", box: tbox(X(t), py1 + 32 * s, 14 * s, 90 * s, { anchor: "middle" }) }));
    legend(d, 772 * s, (px0 + px1) / 2, s);
    // the sticky note: paper card, 1 unit hairline, 6 radius, bold sans title over serif text, riding on the figure's left
    const nx = 96 * s; const ny = 214 * s; const nw = 360 * s; const pad = 22 * s;
    const body = d.value("note_text").text; const n = Math.max(1, measure.wrapText(body, 18 * s, nw - 2 * pad, 0, { serif: true }).length);
    const nh = pad + 22 * s + 14 * s + n * 18 * s * 1.5 + pad - 4 * s;
    d.raw(`<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nh)}" rx="${f1(6 * s)}" fill="${d.pal.paper}" stroke="${d.pal.line}" stroke-width="1" data-role="paper"/>`);
    const ty = ny + pad + 16 * s;
    d.text("note_title", nx + pad, ty, 18 * s, { role: "ink", family: "sans", weight: 700, box: tbox(nx + pad, ty, 18 * s, nw - 2 * pad) });
    const by = ty + 14 * s + 18 * s * 1.1;
    d.text("note_text", nx + pad, by, 18 * s, { role: "ink", family: "serif", weight: 400, lineHeight: 1.5, box: tbox(nx + pad, by, 18 * s, nw - 2 * pad, { lines: n, lh: 1.5 }) });
    d.zone("note", "safe", [nx, ny, nw, nh], { slots: ["note_title", "note_text"] });
  },

  // ---- flow: a paper band of hand-drawn icons joined by clay arrows, a label under each: 1600 x 900 ---
  "card.essay-flow"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d); crayonLine(d, s);
    const n = Math.round(p.count); const k = 1.8 * s;
    const bx = 120 * s; const bw = 1360 * s; const bh = 240 * s; const by = 300 * s; const cy = by + bh / 2;
    d.raw(`<rect x="${f1(bx)}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bh)}" rx="${f1(bh / 2)}" fill="${d.pal.paper}" stroke="${d.pal.line}" stroke-width="1" data-role="paper"/>`);
    const step = bw / n; const names = Array.from({ length: n }, (_, i) => ICON_NAMES[(Math.round(p.icon_start) + i) % ICON_NAMES.length]);
    const cx = names.map((_, i) => bx + step * (i + 0.5));
    const hw = names.map((name) => ICONS[name].hw * k);
    d.raw(`<g data-deco="1" filter="url(#essay-line)">${names.map((name, i) => icon(name, cx[i], cy, k, d.pal.ink)).join("")}</g>`);
    // arrows: a clay shaft with a two-stroke head, kept 18 units clear of both icons
    const arrows = [];
    for (let i = 0; i + 1 < n; i += 1) {
      const x1 = cx[i] + hw[i] + 18 * s; const x2 = cx[i + 1] - hw[i + 1] - 18 * s;
      if (x2 - x1 < 40 * s) continue;
      arrows.push(`<path d="M${f1(x1)} ${f1(cy)}L${f1(x2)} ${f1(cy)}M${f1(x2 - 16 * s)} ${f1(cy - 11 * s)}L${f1(x2)} ${f1(cy)}L${f1(x2 - 16 * s)} ${f1(cy + 11 * s)}" fill="none" stroke="${d.pal.clay}" stroke-width="${f1(4.4 * s)}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
    d.raw(`<g data-deco="1" filter="url(#essay-line)">${arrows.join("")}</g>`);
    const fs = 24 * s; const lw = Math.min(step - 24 * s, 340 * s); const ly = by + bh + 64 * s;
    for (let i = 1; i <= n; i += 1) d.text(`label_${i}`, cx[i - 1], ly, fs, { role: "mute", family: "sans", weight: 400, anchor: "middle", box: tbox(cx[i - 1], ly, fs, lw, { anchor: "middle" }) });
    d.zone("flow", "safe", [bx, by, bw, bh + 100 * s], { slots: Array.from({ length: n }, (_, i) => `label_${i + 1}`) });
  },

  // ---- pull quote: 1600 x 900 -----------------------------------------------------------------------
  "card.essay-pullquote"(d) {
    const { W, H } = d; const s = W / 1600;
    begin(d);
    const L = 250 * s; const cw = 1100 * s; const qs = 54 * s; const lh = 1.28;
    const body = d.value("quote").text; const n = Math.min(4, Math.max(1, measure.wrapText(body, qs, cw, 0, { serif: true }).length));
    const block = 120 * s + n * qs * lh + 70 * s; const top = (H - block) / 2;
    // the open-quote glyph: clay, large, decoration (clay on ivory is 2.96:1, below the 3:1 of large type)
    d.raw(`<text data-deco="1" x="${f1(L - 6 * s)}" y="${f1(top + 150 * s)}" font-family="${esc(d.families.serif)}" font-size="${f1(220 * s)}" fill="${d.pal.clay}" data-role="clay">“</text>`);
    const q0 = top + 120 * s + qs * 0.88;
    d.text("quote", L, q0, qs, { role: "ink", family: "serif", weight: 400, lineHeight: lh, box: tbox(L, q0, qs, cw, { lines: n, lh }) });
    const ay = q0 + (n - 1) * qs * lh + 62 * s;
    d.text("attribution", L, ay, 18 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, ay, 18 * s, cw) });
    d.zone("quote", "safe", [L - 10 * s, 0, cw + 20 * s, H], { slots: ["quote", "attribution"] });
  },

  // ---- three scenario cards: 1600 x 900 -------------------------------------------------------------
  "doc.essay-scenarios"(d) {
    const { W, H, p } = d; const s = W / 1600;
    begin(d); crayon(d, s);
    const L = 116 * s; const cw = 440 * s; const gap = 24 * s; const cy = 300 * s; const ch = 350 * s; const pad = 28 * s;
    d.text("heading", L, 150 * s, 44 * s, { role: "ink", family: "serif", weight: 400, lineHeight: 1.2, box: tbox(L, 150 * s, 44 * s, 1368 * s, { lines: 1 }) });
    d.text("lede", L, 214 * s, 18 * s, { role: "mute", family: "sans", weight: 400, box: tbox(L, 214 * s, 18 * s, 1368 * s) });
    const sw = [];
    [1, 2, 3].forEach((i, k) => {
      const x = L + k * (cw + gap);
      d.raw(`<rect x="${f1(x)}" y="${f1(cy)}" width="${f1(cw)}" height="${f1(ch)}" rx="${f1(8 * s)}" fill="${d.pal.paper}" stroke="${d.pal.line}" stroke-width="1" data-role="paper"/>`);
      for (let j = 0; j < 3; j += 1) sw.push(`<rect x="${f1(x + pad + j * 28 * s)}" y="${f1(cy + pad)}" width="${f1(24 * s)}" height="${f1(24 * s)}" rx="${f1(3 * s)}" fill="${d.pal[j < Math.round(p[`level_${i}`]) ? DATA[k] : "tile"]}" data-role="${j < Math.round(p[`level_${i}`]) ? DATA[k] : "tile"}"/>`);
      const inner = cw - 2 * pad;
      d.text(`title_${i}`, x + pad, cy + 110 * s, 24 * s, { role: "ink", family: "sans", weight: 700, box: tbox(x + pad, cy + 110 * s, 24 * s, inner) });
      d.text(`sub_${i}`, x + pad, cy + 148 * s, 16 * s, { role: "mute", family: "sans", weight: 400, box: tbox(x + pad, cy + 148 * s, 16 * s, inner) });
      d.text(`text_${i}`, x + pad, cy + 206 * s, 19 * s, { role: "ink", family: "serif", weight: 400, lineHeight: 1.5, box: tbox(x + pad, cy + 206 * s, 19 * s, inner, { lines: 5, lh: 1.5 }) });
    });
    d.raw(`<g filter="url(#essay-crayon)">${sw.join("")}</g>`);
    d.text("credits", L, 750 * s, 17 * s, { role: "mute", family: "serif", weight: 400, italic: true, box: tbox(L, 750 * s, 17 * s, 1368 * s) });
  },
};

module.exports = { LAYOUTS };
