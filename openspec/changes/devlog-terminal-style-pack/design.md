# Design

## Decisions (made without asking)

- **Named by the grammar, never the site**: `devlog-terminal` (a developer log in a terminal grammar).
  No file, test, commit or PR names the reference blog, its publisher, its products, its fonts or its
  mascot; the lineage line is generic. The capture stays with the owner; the pack carries only measured
  numbers (palette, type sizes, column width, row structure).
- **Borrow grammar, never assets**: the reference's proprietary faces are replaced by open substitutes
  named through the font catalog (JetBrains Mono / IBM Plex Mono / Geist Mono; Inter / Geist; Noto Sans SC
  for CJK), named not bundled. Its pixel mascot is not drawn: `mascot` is an empty image slot in the nav
  and the dot field. The clay tiles carry six 9 x 9 glyphs drawn for this pack (bug, check, flask, chart,
  prompt, bolt).
- **Dim is not a text colour**: the measured dim grey `#5E5D59` is 2.8:1 on the ground, under 4.5:1. It
  is used for dots, unfilled progress blocks, bullets and outlines; every text role uses `#87867F` (5.1:1)
  or lighter. Hairlines are `<line>` strokes, not filled rects, so the static check never takes a hairline
  as the ground under a text.
- **Branch corners and progress blocks are drawn**, not typed: the reference sets `└` and the block
  characters as text; here they are paths and squares, so no monospace face has to cover them and
  `glyph-coverage` has nothing to flag. The percent is a derived slot (`progress`).
- **CJK-safe mono**: the mono roles are Latin chrome. The layout's `put` sets any string a mono face
  cannot carry (CJK, symbols outside Latin-1, arrows and box drawing) whole in the sans role of the same
  weight, so a CJK date, label or tab never falls back glyph by glyph. Widths for layout use true monospace
  advances (0.6 em; CJK 1 em) next to the check's proportional model, whichever is wider.
- **Rows as parameters**: `rows` (6-8) is a rhythm parameter; the row slots are indexed (`row_title_{i}`)
  with rotated array defaults, like `lattice-columns`, so `--set row_title_7=...` with `rows=6` fails with
  "not drawn" and a fix.
- **The dot field is a seeded function**: four dot radii from soft Gaussian blobs on a 24-unit grid, a
  clear 118-unit disc for the mascot and a clear corner for the label; the same `seed` renders the same
  bytes (`rng` from `layout-kit.cjs`).
- **Templates are the parts, not the site**: the footer link columns and the newsletter input of the
  reference are page furniture and stay examples with the owner; the bank keeps the five parts that recur.
  The kit page carries that furniture (footer columns, the newsletter box) in our own copy.
- **The kit is the owner's finished page**: `examples/devlog-terminal-note-kit/index.html` is one file, no
  build; fonts load from a CDN with local fallbacks. The pixel whale on it is the owner's own mascot, so it
  stays; the reference blog's mascot is never drawn. A label that was moved off canvas with `left:-9999px`
  became an `aria-label` on its input, because the browser check reads an off-canvas label as text running
  off the page (the page is fixed, never the check).
- **Motion is part of the grammar and settles for reduced motion**: a typewriter title behind a clay block
  cursor blinking at 1 Hz, tile wipe-in in 6 steps, chart blocks filling one by one on view, a canvas dot
  shimmer that pauses off screen, a hop on mascot click. `prefers-reduced-motion` shows the final state. The
  repository's check already freezes CSS transitions and animations; the test additionally launches Chrome
  with `--force-prefers-reduced-motion` so scripted motion (the typewriter) is in its final state and the
  check is deterministic. `page-check.cjs` is unchanged.
- **Fast checks**: the kit check is one screenshot pair per text unit, so it is the slow part. Each width
  runs once, in its own Chrome and in parallel with the other width and with the static tests, the page
  height is measured in that Chrome, and the default renders share one Chrome in process (no CLI spawn per
  render). Helper: `tests/helpers/kit-browser-check.cjs`.

## Evidence

- Static: every default render, each listed size and 50 seeds pass, and the variants (rows 6 and 8,
  progress 0 and 100, tree_items 3, all glyphs, density and seed extremes, CJK copy in mono slots).
- Browser: every default render passes `template check --browser` with 0 findings; the kit page passes the
  browser half at 1440 and 390 wide with motion settled.

## Compatibility

Additive. No schema, rule, gate, receipt or CLI change; other templates' renders are unchanged.
