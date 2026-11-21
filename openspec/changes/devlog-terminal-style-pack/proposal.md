# devlog-terminal: a developer technical-writing blog's terminal grammar as a style pack

## Why

The owner named a public developer technical-writing blog and asked to learn its grammar (layout and
type, no assets). We captured and measured it privately in Chrome on 2026-11-21 (palette, type sizes,
the hotkey nav, the index with a featured row, the article with a TREE rail and an ASCII progress bar,
the figure caption box, the closing dot field). The grammar (a near-black ground with warm ink, monospace
chrome over a neutral grotesque, hairline rows, one inverted square button, one clay accent that is only
ever a filled tile carrying a 1-bit pixel glyph) is not in the bank: `acid-print-hud` and
`lattice-dossier` are dark but neon-accented and frame-led, `atomic-age` carries a typewriter mono on
cream paper. Without a pack the next developer-blog or changelog brief re-learns the same traps (dim grey
text under contrast, a CJK date in a Latin-only mono face, a mascot copied from the reference).

## What Changes

- **Style pack `devlog-terminal`** in `skill/tools/template-bank/styles/devlog-terminal/style.json`
  (`design-pipeline.template-bank-style.v1`): seven palette roles from the measurements, four font roles
  through the catalog with fallbacks (open mono and grotesque substitutes, Noto Sans SC for CJK), the
  layout grammar, materials and recipes, motion grammar, checks with the 64 px test and the traps as
  guidance, provenance ("borrow grammar, never assets", lineage, 2026-11-21) and examples. It names no
  organisation or product; the lineage is the generic "developer technical-writing blog with a terminal
  grammar".
- **Five templates** rendered from parameters with original copy: `ui.devlog-index` (1440 x 900, rows
  `rows` 6-8), `ui.devlog-article` (1440 x 900, `progress`, `current`, `tree_items`),
  `ui.devlog-article-header` (1440 x 560), `card.devlog-fig` (960 x 600) and `banner.devlog-dotfield`
  (1440 x 480, `seed`, `density`). The pixel glyphs on the clay tiles are the pack's own (`GLYPHS`);
  the mascot is an image slot the owner fills with their own art.
- No change to `template check`, its rules, schemas, gates or CLI flags.

## Capabilities

- `design-pipeline`: the template bank gains one style pack and five templates.

## Reuse

- `template list|render|check`, the style and manifest schemas, `Doc.text`/`Doc.image`, `rng`, `f1` and
  `invalid` from `layout-kit.cjs`, `measure.textWidth`, the `BankError` codes and exit codes 0 / 2 / 1.
  The pack follows `street-tape-style-pack` (pack file, layout module, template folders, test, registry).

## Impact

- New: `tools/template-bank/layouts-devlog.cjs`, `styles/devlog-terminal/style.json`, five template
  folders, `tests/template-devlog-terminal.test.cjs`.
- Changed: `bank.cjs` (layout registry list), `references/template-bank.md`, `package-resources.json`,
  `scripts/test-manifest.json`, `CHANGELOG.md`; counts in `tests/template-bank.test.cjs` and
  `tests/template-style-pack.test.cjs`.
