# Design

## Decisions (made without asking)

- **Named by the grammar, never the source**: `institute-essay`; templates are named by what they are
  (`cover.essay-hero`, `card.essay-finding`). No file, test, commit or PR names an organisation, product,
  logo or wordmark; the lineage line is a generic genre description. The two reference pages stay with the
  owner; the pack carries only numbers measured on them.
- **Measured numbers, not taste**: ground #FAF9F5, ink #141413, secondary #5E5D59, faint #87867F, neutrals
  #BDBAAE and #E3E0D4, paper card #F5F4ED, dark ground #141413, clay #D97757 (hero burst, footnote marks,
  quote glyph), data hues #918BD6 #6A9BCC #F0AC54 #217D5D #B0403A and the neutral tile #D6D3C6 inside figures
  only. Type: serif display and body, sans labels; H1 78 px / 1.1 at weight 400, deck 17 px sans, body
  17 / 26 px, reading column 640 px, H3 sans 17 px bold, footnote heading sans 13 px, pull quote serif 36 / 45
  px about 946 px wide, graph paper on a 22 px grid, sticky note 340 px wide with a 6 px radius.
- **Own faces, not theirs**: the originals are proprietary. The pack names Source Serif 4 (transitional book
  serif) and Inter, with Noto Serif SC and Noto Sans SC for CJK; every stack holds a catalog family, so the
  fallback is always a family the catalog knows. Fonts are named, not bundled; `--font-dir` embeds them.
- **Roles are named `serif` and `sans`**: the layout engine wraps and measures a role literally named `serif`
  with the wide serif model, the same one the static check applies to a family whose name contains Serif,
  so wrapped slots and the check agree.
- **Faint grey is for large type only**: #87867F on ivory is about 3.6:1, which passes the 3:1 of large text
  (the "Finding N: topic" label at 30 px) and fails 4.5:1 for small text, so every small line (meta, footnote,
  legend, captions) uses the secondary #5E5D59. Clay is large type or decoration only (about 3:1 on ivory).
- **Figures the static check can read**: graph paper is a `<pattern>` (the static check hides patterns, so
  it sees the ivory ground, and the pattern's lines are 1 px #EBE8DC), the crayon is one filter applied to
  bars, tiles and the burst; the shapes under the filter are plain rects, so the check measures their
  geometry, never the filter. No text sits on a textured shape: values and labels sit beside the bars on the
  paper.
- **Crayon, not watercolour**: the owner found the first soft-light grain too smooth against the references'
  hand-made look. The fill filter is `feTurbulence` displacement (a wobbling edge, `scale` 4) plus a streak
  noise stretched along x (`baseFrequency` .025 .55) multiplied with a fine paper-tooth noise (1.1), turned
  into the fill's alpha with `feColorMatrix` and masked with `feComposite in`, so colour breaks into waxy
  streaks with the paper showing through; the same filter as the kit page's `#wc`. Frequencies are per user
  unit, so the layout divides them by its scale and a 1920 render keeps the look. A second, finer line filter
  (`#cl` in the kit) roughens strokes for icons and arrows. Five hand-drawn line icons (data stack, laptop,
  fork, page, person) are paths in a local 84-unit box in `layouts-essay.cjs`; `card.essay-flow` uses them.
  The filters take no parameter: the texture is a material, not a knob.
- **The flow card counts nodes, not slots**: `count` (3-5) is a parameter and the labels are `label_{i}`
  slots, so unused labels are simply not drawn; `icon_start` rotates the icon order. Arrows stay 18 units clear
  of the icons and are dropped when the gap would be under 40 units.
- **Bar values are parameters** (`value_1..3`, `max`), not slots: the value text is derived
  (`+12%`), the bar is scaled to `max`, so a number and its bar cannot disagree.
- **The burst is seeded**: a 15 x 15 grid, radius 7.5, rounded clay squares kept by a ray-and-noise score;
  `seed` picks the noise (mulberry-style, byte-stable per render), `density` the keep threshold. Clay stays
  under the 22% accent budget for every seed (the test runs 50).
- **The HTML kit copies, it does not extend**: the owner's finished page is the kit; it is one file, no build.
  Its fonts load from a CDN with the stack's local fallbacks, so it also reads offline.
- **Templates are the parts, not the essay**: a whole essay is a scrolling page with interaction; the bank
  keeps the six parts that recur (hero, finding with bars, figure with note, pull quote, scenario cards, flow
  band).
  Timeline rows, footnote lists and the drop cap live in the kit.

- **Motion on the kit, settled for the check**: `prefers-reduced-motion` shows the final state. The check
  already freezes CSS transitions and animations; the test also launches Chrome with
  `--force-prefers-reduced-motion` so scripted motion is in its final state. `page-check.cjs` is unchanged. The
  scrollytelling stage and steps cap their `vh` heights (`min(100vh, 860px)`), because the check sets the
  viewport to the whole page height and a plain `100vh` stage would then be the whole page.
- **Fast checks**: each kit width runs once, in its own Chrome and in parallel with the other width and the
  static tests; the page height is measured in that Chrome; the default renders share one Chrome in process
  (`tests/helpers/kit-browser-check.cjs`).

## Evidence

- Measurement: computed styles of both pages in Chrome on 2026-11-21 (private), sizes above.
- Templates: every default render, each listed size and 50 seeds pass the static check; the default renders
  pass `template check --browser`.
- Kit: `template check examples/institute-essay-report-kit/index.html --browser` at 1440 and 390 wide.

## Compatibility

Additive. No schema, rule, gate, receipt or CLI change; other templates' renders are unchanged.
