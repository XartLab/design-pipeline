"use strict";

// The original illustration kit of the brand-band style pack (styles/brand-band/style.json): eight hand-drawn
// subjects in a 400-unit box, code-drawn, deterministic, for flat colour-field squares. Grammar only: a black
// marker line of varying width (a ribbon: tapered ends, a swell, a low-frequency wobble, closed shapes that
// overshoot their start and miss it by a hair), a few flat misregistered fills (paper, clay, olive, sky) and
// a lot of empty field. Every subject is our own drawing: nothing is traced or copied from any site.
//
// A subject is { name, strokes: [{ d, c }], fills: [{ d, role }] } in drawing order (fills and strokes
// interleave through `order`). `d` is the filled outline of a stroke (a ribbon polygon), `c` its centre line,
// which the HTML kit uses as a mask path to draw the stroke in on scroll. The layouts use `d` only.

const f1 = (v) => Number(v).toFixed(1);

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

// Smooth 1-D value noise in [0, 1]: random knots joined by a cosine ease.
function noise(seed) {
  const r = mulberry(seed * 7919 + 13);
  const knots = Array.from({ length: 24 }, () => r());
  return (x) => {
    const i = Math.floor(x); const t = x - i; const e = (1 - Math.cos(t * Math.PI)) / 2;
    return knots[((i % 24) + 24) % 24] * (1 - e) + knots[(((i + 1) % 24) + 24) % 24] * e;
  };
}

// Catmull-Rom through the points, sampled `per` times a segment. Closed shapes wrap around.
function sample(pts, closed, per, extra = 0) {
  const n = pts.length; const out = [];
  const at = (i) => (closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const segs = closed ? n : n - 1;
  const total = Math.round((segs + extra) * per);
  for (let s = 0; s <= total; s += 1) {
    const u = s / per; const i = Math.min(Math.floor(u), segs + Math.ceil(extra) - 1); const t = u - i;
    const p0 = at(i - 1); const p1 = at(i); const p2 = at(i + 1); const p3 = at(i + 2);
    const q = (k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t * t * t);
    out.push([q(0), q(1)]);
  }
  return out;
}

// One marker stroke: the centre line wobbles a little, the width swells in the middle and tapers to blunt ends.
function ribbon(pts, { w = 6, seed = 1, closed = false } = {}) {
  const nz = noise(seed); const nw = noise(seed + 101);
  const raw = sample(pts, closed, 5, closed ? 0.5 : 0);
  const m = raw.length; const centre = []; const half = [];
  for (let i = 0; i < m; i += 1) {
    const t = i / (m - 1);
    const a = raw[Math.max(0, i - 1)]; const b = raw[Math.min(m - 1, i + 1)];
    let tx = b[0] - a[0]; let ty = b[1] - a[1]; const len = Math.hypot(tx, ty) || 1; tx /= len; ty /= len;
    const wob = (nz(t * 5.3) - 0.5) * 2.4 + (closed ? t * 1.6 : 0);
    centre.push([raw[i][0] - ty * wob, raw[i][1] + tx * wob]);
    const ends = Math.min(1, t / 0.1, (1 - t) / 0.16);
    const k = 0.38 + 0.62 * Math.pow(Math.max(0, ends), 0.7);
    half.push((w / 2) * k * (0.82 + 0.4 * nw(t * 4.1)) * (0.88 + 0.24 * Math.sin(Math.PI * Math.min(1, t * 1.15))));
  }
  const left = []; const right = [];
  for (let i = 0; i < m; i += 1) {
    const a = centre[Math.max(0, i - 1)]; const b = centre[Math.min(m - 1, i + 1)];
    let tx = b[0] - a[0]; let ty = b[1] - a[1]; const len = Math.hypot(tx, ty) || 1; tx /= len; ty /= len;
    left.push([centre[i][0] - ty * half[i], centre[i][1] + tx * half[i]]);
    right.push([centre[i][0] + ty * half[i], centre[i][1] - tx * half[i]]);
  }
  const cap = (c, i, sign) => {
    const a = centre[Math.max(0, i - 1)]; const b = centre[Math.min(m - 1, i + 1)];
    let tx = b[0] - a[0]; let ty = b[1] - a[1]; const len = Math.hypot(tx, ty) || 1; tx /= len; ty /= len;
    const h = half[i]; const nx = -ty; const ny = tx;
    return [[c[0] + sign * tx * h * 0.72 + nx * h * 0.72, c[1] + sign * ty * h * 0.72 + ny * h * 0.72], [c[0] + sign * tx * h, c[1] + sign * ty * h], [c[0] + sign * tx * h * 0.72 - nx * h * 0.72, c[1] + sign * ty * h * 0.72 - ny * h * 0.72]];
  };
  const poly = [...left, ...cap(centre[m - 1], m - 1, 1), ...right.reverse(), ...cap(centre[0], 0, -1)];
  const d = `M${poly.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L")}Z`;
  const c = `M${centre.filter((_, i) => i % 2 === 0 || i === m - 1).map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L")}`;
  return { d, c };
}

// A flat blob: a closed smooth outline with a slight irregularity, nudged by (dx, dy) so it misses its line.
function blob(pts, { seed = 1, dx = 0, dy = 0, jitter = 1.4 } = {}) {
  const nz = noise(seed + 55);
  const moved = pts.map(([x, y], i) => [x + dx + (nz(i * 1.7) - 0.5) * 2 * jitter, y + dy + (nz(i * 1.7 + 9) - 0.5) * 2 * jitter]);
  const raw = sample(moved, true, 4);
  return `M${raw.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L")}Z`;
}

// Points of an ellipse (n knots, enough for a smooth Catmull-Rom loop), starting at angle a0.
function ellipse(cx, cy, rx, ry, n = 8, a0 = -2.2, wob = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = a0 + (i / n) * 2 * Math.PI; const k = 1 + wob * Math.sin(i * 2.3 + a0 * 3);
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  });
}

const rot = (pts, deg, [cx, cy]) => { const a = (deg * Math.PI) / 180; return pts.map(([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]); };
const mirror = (pts) => pts.map(([x, y]) => [400 - x, y]);

// A hand seen from the side, palm up, fingers to the right, sleeve at the left: one closed silhouette (cuff,
// wrist, a thumb that rises, four stacked fingers with notches) filled flat paper, plus the finger seams.
// Returns drawing items for (ox, oy, scale), mirrored for a hand coming from the right.
function hand(ox = 0, oy = 0, sc = 1, flip = false, line = 5.4) {
  const T = (pts) => { const q = pts.map(([x, y]) => [200 + (x - 200) * sc + ox, 300 + (y - 300) * sc + oy]); return flip ? mirror(q) : q; };
  const outline = T([[56, 268], [122, 272], [146, 258], [156, 234], [176, 222], [194, 232], [200, 252], [246, 254], [282, 250], [294, 259], [282, 268], [250, 272], [284, 276], [297, 286], [284, 295], [250, 293], [278, 298], [284, 308], [262, 313], [224, 315], [150, 318], [56, 314]]);
  return [
    { fill: outline, role: "paper", dx: flip ? -6 : 6, dy: 5 },
    { stroke: outline, w: line * sc + 1, closed: true },
    { stroke: T([[200, 252], [226, 266], [250, 272]]), w: (line - 1.6) * sc + 0.8 },
    { stroke: T([[188, 276], [222, 283], [250, 293]]), w: (line - 1.6) * sc + 0.8 },
    { stroke: T([[124, 296], [160, 302], [208, 304]]), w: (line - 2) * sc + 0.8 },
  ];
}

const SUBJECTS = {
  // a hand holding up a small network of nodes
  "hand-graph": {
    title: "hand holding a node graph",
    build() {
      const o = [];
      const nodes = [[200, 186, 22], [132, 148, 16], [268, 144, 16], [146, 88, 12], [258, 84, 12]];
      const edges = [[0, 1], [0, 2], [1, 3], [2, 4]];
      for (const [a, b] of edges) {
        const [x1, y1, r1] = nodes[a]; const [x2, y2, r2] = nodes[b]; const L = Math.hypot(x2 - x1, y2 - y1);
        const p = (x, y, r, s) => [x + ((x2 - x1) / L) * r * s, y + ((y2 - y1) / L) * r * s];
        const s0 = p(x1, y1, r1 - 6, 1); const s1 = p(x2, y2, r2 - 6, -1);
        o.push({ stroke: [s0, [(s0[0] + s1[0]) / 2 + (a + b) % 3 - 1, (s0[1] + s1[1]) / 2 + 1.5], s1], w: 4.6 });
      }
      nodes.forEach(([x, y, r], i) => o.push({ fill: ellipse(x, y, r, r * 0.96, 8, -2 + i, 0.05), role: i === 0 ? "paper" : i === 3 ? "accent" : "paper", dx: 5, dy: 4 }));
      nodes.forEach(([x, y, r], i) => o.push({ stroke: ellipse(x, y, r, r * 0.96, 8, -2 + i * 0.8, 0.04), w: i === 0 ? 5.4 : 4.4, closed: true }));
      o.push(...hand(18, 12, 1));
      return o;
    },
  },

  // a seedling with a couple of sprouting nodes
  seedling: {
    title: "seedling with nodes",
    build() {
      const o = [];
      o.push({ fill: [[96, 306], [148, 288], [200, 284], [256, 288], [306, 306], [250, 322], [150, 322]], role: "paper", dx: 4, dy: 5 });
      o.push({ stroke: [[88, 304], [136, 292], [186, 288], [232, 290], [284, 296], [314, 304]], w: 6.4 });
      [[128, 316, 148, 316], [168, 318, 190, 318], [220, 316, 246, 315], [262, 313, 280, 312]].forEach(([x1, y1, x2, y2]) => o.push({ stroke: [[x1, y1], [(x1 + x2) / 2, y1 + 1.2], [x2, y2]], w: 3.6 }));
      o.push({ stroke: [[200, 290], [197, 262], [203, 232], [199, 202], [200, 170]], w: 6 });
      const leafL = [[198, 244], [172, 250], [146, 236], [130, 208], [136, 186], [162, 192], [188, 214]];
      const leafR = [[203, 214], [232, 222], [264, 206], [282, 176], [278, 150], [250, 152], [222, 172]];
      o.push({ fill: leafL, role: "accent", dx: 6, dy: 5 });
      o.push({ fill: leafR, role: "accent2", dx: 6, dy: 5 });
      o.push({ stroke: leafL, w: 5.2, closed: true });
      o.push({ stroke: leafR, w: 5.2, closed: true });
      o.push({ stroke: [[196, 242], [168, 224], [144, 200]], w: 3.6 });
      o.push({ stroke: [[205, 212], [238, 198], [270, 168]], w: 3.6 });
      o.push({ stroke: [[200, 170], [176, 150], [158, 150]], w: 4.4 });
      o.push({ stroke: [[200, 170], [214, 142], [236, 118]], w: 4.4 });
      [[200, 170, 13], [152, 150, 9], [242, 112, 10]].forEach(([x, y, r], i) => {
        o.push({ fill: ellipse(x, y, r, r, 8, -2 + i), role: i === 2 ? "clay" : "paper", dx: 3, dy: 3 });
        o.push({ stroke: ellipse(x, y, r, r, 8, -1.6 + i), w: 4.4, closed: true });
      });
      return o;
    },
  },

  // an open book with a branching tree of thoughts rising from the spine
  book: {
    title: "open book with branching lines",
    build() {
      const o = [];
      const left = [[88, 196], [140, 192], [196, 214], [196, 306], [140, 288], [86, 292]];
      const right = [[312, 196], [260, 192], [204, 214], [204, 306], [260, 288], [314, 292]];
      o.push({ fill: left, role: "paper", dx: 6, dy: 5 });
      o.push({ fill: right, role: "paper", dx: 6, dy: 5 });
      o.push({ stroke: [[92, 292], [88, 242], [90, 198], [140, 194], [196, 216], [197, 306], [140, 290], [92, 293]], w: 5.6, closed: true });
      o.push({ stroke: [[308, 292], [312, 242], [310, 198], [260, 194], [204, 216], [203, 306], [260, 290], [308, 293]], w: 5.6, closed: true });
      [[110, 226, 168, 240], [110, 246, 170, 260], [110, 266, 150, 276]].forEach(([x1, y1, x2, y2]) => o.push({ stroke: [[x1, y1], [(x1 + x2) / 2, (y1 + y2) / 2 + 1.5], [x2, y2]], w: 3.6 }));
      [[232, 240, 290, 226], [232, 260, 290, 246], [232, 280, 270, 272]].forEach(([x1, y1, x2, y2]) => o.push({ stroke: [[x1, y1], [(x1 + x2) / 2, (y1 + y2) / 2 + 1.5], [x2, y2]], w: 3.6 }));
      o.push({ stroke: [[200, 214], [199, 178], [200, 140], [198, 104]], w: 5.4 });
      o.push({ stroke: [[199, 172], [176, 156], [152, 150]], w: 4.4 });
      o.push({ stroke: [[200, 150], [226, 134], [252, 130]], w: 4.4 });
      o.push({ stroke: [[199, 124], [176, 104], [160, 82]], w: 4.4 });
      [[148, 148, 11, "paper"], [258, 128, 11, "clay"], [156, 76, 10, "paper"], [198, 94, 12, "paper"]].forEach(([x, y, r, role], i) => {
        o.push({ fill: ellipse(x, y, r, r, 8, -2 + i), role, dx: 3, dy: 3 });
        o.push({ stroke: ellipse(x, y, r, r, 8, -1.7 + i), w: 4.2, closed: true });
      });
      return o;
    },
  },

  // a magnifier lens over a waveform
  magnifier: {
    title: "magnifier over a waveform",
    build() {
      const o = [];
      o.push({ stroke: [[70, 262], [104, 262], [118, 238], [134, 290], [152, 224], [170, 296], [188, 250], [206, 262], [250, 262], [290, 262], [332, 262]], w: 5 });
      o.push({ fill: ellipse(214, 186, 68, 66, 10, -2.4, 0.015), role: "paper", dx: 7, dy: 6 });
      o.push({ stroke: [[160, 190], [180, 190], [190, 166], [204, 214], [218, 160], [232, 206], [244, 188], [264, 188]], w: 5, seed: 7 });
      o.push({ stroke: ellipse(214, 186, 68, 66, 10, -2.4, 0.015), w: 7.2, closed: true });
      o.push({ stroke: [[264, 236], [284, 262], [304, 292], [320, 312]], w: 13 });
      return o;
    },
  },

  // two hands passing a spark
  "spark-hands": {
    title: "two hands passing a spark",
    build() {
      const o = [];
      const spark = [[200, 150], [212, 188], [248, 200], [212, 212], [200, 250], [188, 212], [152, 200], [188, 188]];
      o.push({ fill: spark, role: "accent", dx: 6, dy: 5 });
      o.push({ stroke: spark, w: 5, closed: true });
      [[200, 116, 200, 132], [246, 144, 232, 156], [154, 144, 168, 156], [258, 200, 274, 200], [126, 200, 142, 200]].forEach(([x1, y1, x2, y2]) => o.push({ stroke: [[x1, y1], [(x1 + x2) / 2 + 0.6, (y1 + y2) / 2], [x2, y2]], w: 4 }));
      o.push(...hand(-68, 12, 0.62, false, 6.2));
      o.push(...hand(-68, 12, 0.62, true, 6.2));
      return o;
    },
  },

  // a mountain path with markers and a flag
  path: {
    title: "mountain path with markers",
    build() {
      const o = [];
      const back = [[96, 304], [150, 218], [196, 150], [244, 226], [290, 304]];
      const front = [[160, 304], [216, 232], [262, 176], [306, 240], [338, 304]];
      o.push({ fill: back, role: "accent", dx: 6, dy: 5 });
      o.push({ fill: front, role: "paper", dx: 6, dy: 5 });
      o.push({ stroke: [[92, 304], [150, 218], [196, 150], [244, 228], [286, 292]], w: 5.4 });
      o.push({ stroke: [[160, 304], [216, 232], [262, 176], [304, 238], [338, 304]], w: 5.4 });
      o.push({ stroke: [[72, 306], [150, 308], [250, 304], [330, 308]], w: 5 });
      o.push({ stroke: [[236, 304], [262, 286], [228, 266], [266, 246], [246, 224], [262, 204]], w: 4.4 });
      [[262, 286, 9], [228, 266, 9], [266, 246, 9]].forEach(([x, y, r], i) => {
        o.push({ fill: ellipse(x, y, r, r, 8, -2 + i), role: "paper", dx: 2, dy: 2 });
        o.push({ stroke: ellipse(x, y, r, r, 8, -1.8 + i), w: 4, closed: true });
      });
      o.push({ stroke: [[196, 154], [197, 124], [196, 98]], w: 4.6 });
      o.push({ fill: [[196, 98], [232, 108], [197, 122]], role: "clay", dx: 3, dy: 3 });
      o.push({ stroke: [[197, 98], [231, 108], [198, 122]], w: 4, seed: 4 });
      return o;
    },
  },

  // candles growing leaves
  candles: {
    title: "candle-stick chart growing leaves",
    build() {
      const o = [];
      const bars = [[116, 262, 292, 246, 300, "paper"], [152, 232, 286, 216, 296, "accent"], [188, 244, 282, 232, 292, "paper"], [224, 196, 280, 180, 290, "accent"], [260, 164, 270, 148, 284, "accent"]];
      o.push({ stroke: [[76, 302], [150, 305], [240, 302], [322, 305]], w: 5.4 });
      bars.forEach(([cx, top, bot, wt, wb, role], i) => {
        const hw = 13;
        const box = [[cx - hw, top], [cx + hw, top + 1.5], [cx + hw - 1, bot], [cx - hw + 1, bot - 1]];
        o.push({ fill: box, role, dx: 5, dy: 4, jitter: 0.6 });
        o.push({ stroke: [[cx, wt], [cx + 0.6, (wt + top) / 2], [cx, top]], w: 4.4, seed: i + 2 });
        o.push({ stroke: [[cx, bot], [cx - 0.5, (bot + wb) / 2], [cx, wb]], w: 4.4, seed: i + 12 });
        o.push({ stroke: [[cx - hw, top + 1], [cx + hw, top], [cx + hw - 0.5, bot - 1], [cx - hw + 0.5, bot], [cx - hw - 0.5, top + 6]], w: 5.2, seed: i + 22 });
      });
      const sx = 260; const sy = 148;
      o.push({ stroke: [[sx, sy], [sx + 2, sy - 26], [sx - 2, sy - 52]], w: 4.8 });
      const l1 = [[sx + 1, sy - 30], [sx + 24, sy - 36], [sx + 46, sy - 58], [sx + 40, sy - 76], [sx + 18, sy - 70], [sx + 2, sy - 50]];
      const l2 = [[sx - 1, sy - 22], [sx - 22, sy - 26], [sx - 42, sy - 46], [sx - 38, sy - 62], [sx - 18, sy - 58], [sx - 2, sy - 40]];
      o.push({ fill: l1, role: "accent", dx: 5, dy: 4 });
      o.push({ fill: l2, role: "accent", dx: 5, dy: 4 });
      o.push({ stroke: l1, w: 4.6, closed: true });
      o.push({ stroke: l2, w: 4.6, closed: true });
      o.push({ stroke: [[sx + 2, sy - 34], [sx + 26, sy - 50], [sx + 38, sy - 66]], w: 3.2 });
      o.push({ stroke: [[sx - 2, sy - 28], [sx - 22, sy - 42], [sx - 32, sy - 54]], w: 3.2 });
      return o;
    },
  },

  // a compass
  compass: {
    title: "compass",
    build() {
      const o = [];
      o.push({ fill: ellipse(200, 196, 104, 102, 10, -2, 0.012), role: "paper", dx: 7, dy: 6 });
      o.push({ stroke: ellipse(200, 196, 104, 102, 10, -2, 0.012), w: 7, closed: true });
      o.push({ stroke: ellipse(200, 196, 84, 82, 9, -1.2, 0.015), w: 3, closed: true, seed: 6 });
      [[200, 96, 200, 112], [200, 280, 200, 296], [100, 196, 116, 196], [284, 196, 300, 196]].forEach(([x1, y1, x2, y2], i) => o.push({ stroke: [[x1, y1], [(x1 + x2) / 2 + 0.6, (y1 + y2) / 2], [x2, y2]], w: 4.4, seed: i + 3 }));
      const ne = rot([[200, 196], [224, 196], [252, 128], [212, 168]], 0, [200, 196]);
      const sw = [[200, 196], [176, 196], [148, 264], [188, 224]];
      o.push({ fill: [[196, 196], [222, 194], [252, 128], [212, 170]], role: "clay", dx: 3, dy: 3 });
      o.push({ stroke: [[196, 196], [222, 194], [252, 128], [210, 172], [196, 196]], w: 4.6, closed: false });
      o.push({ stroke: [[204, 198], [180, 200], [148, 264], [190, 224], [204, 198]], w: 4.6 });
      o.push({ fill: ellipse(200, 196, 9, 9, 7, -2), role: "paper", dx: 0, dy: 0 });
      o.push({ stroke: ellipse(200, 196, 9, 9, 7, -1.5), w: 4, closed: true });
      return o;
    },
  },
};

const IDS = Object.keys(SUBJECTS);

// Resolve a subject to drawing-order items { type: "fill"|"stroke", d, c, role } with a role map for the
// accent fills: accent (the subject's main flat hue), accent2 (its second), paper, clay.
function items(id, accents = {}) {
  const spec = SUBJECTS[id];
  if (!spec) throw new Error(`unknown illustration ${id}`);
  const out = []; let k = 0;
  for (const it of spec.build()) {
    k += 1;
    if (it.fill) {
      const role = it.role === "accent" ? (accents.accent || "olive") : it.role === "accent2" ? (accents.accent2 || "sky") : it.role;
      out.push({ type: "fill", role, d: blob(it.fill, { seed: k + id.length, dx: it.dx || 0, dy: it.dy || 0, jitter: it.jitter ?? 1.4 }) });
    } else {
      const r = ribbon(it.stroke, { w: it.w || 5, seed: it.seed || k + id.length * 3, closed: !!it.closed });
      out.push({ type: "stroke", d: r.d, c: r.c });
    }
  }
  return out;
}

// SVG markup of a subject in its 400-unit box: fills with their data-role and the strokes (ink) as
// plain filled paths. `paint` maps a role to its colour; ink is the line colour.
function svgBody(id, { ink = "#141413", paint = {}, accents = {}, strokeAttrs = "" } = {}) {
  return items(id, accents).map((it) => (it.type === "fill"
    ? `<path d="${it.d}" fill="${paint[it.role]}" data-role="${it.role}"/>`
    : `<path d="${it.d}" fill="${ink}"${strokeAttrs}/>`)).join("");
}

// Inline markup for the HTML kit (one picture in a 400-unit viewBox): fills carry a class f-<role>, strokes the
// class ink and their centre line in data-c, so a script can draw each stroke in through a mask path.
function classBody(id, accents = {}) {
  return items(id, accents).map((it) => (it.type === "fill"
    ? `<path class="f-${it.role}" d="${it.d}"/>`
    : `<path class="ink" d="${it.d}" data-c="${it.c}"/>`)).join("");
}

module.exports = { IDS, SUBJECTS, items, svgBody, classBody, ribbon, blob, ellipse };
