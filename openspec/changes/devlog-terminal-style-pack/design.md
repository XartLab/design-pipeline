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

## Evidence

- Static: every default render, each listed size and 50 seeds pass, and the variants (rows 6 and 8,
  progress 0 and 100, tree_items 3, all glyphs, density and seed extremes, CJK copy in mono slots).
- Browser: every default render passes `template check --browser` with 0 findings.

## Compatibility

Additive. No schema, rule, gate, receipt or CLI change; other templates' renders are unchanged.
