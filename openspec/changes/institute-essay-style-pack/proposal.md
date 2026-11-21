# institute-essay: an AI research institute's long-form explainer grammar as a style pack and an HTML long-read kit

## Why

The owner named two public pages in the genre of "AI research institute long-form explainers and research
essays" and asked to learn their look for reports ("研报") and later templates. We captured and measured both in
Chrome (computed styles, 2026-11-21; the captures stay private and nothing from them is shipped). The grammar
is calm and editorial: an ivory page, one clay accent, a transitional book serif for display and body against
a neutral grotesque for every label, a 640 px reading column, and figures that break out to full width on
graph paper with crayon-textured bars, a sticky note riding on the figure and a "How to read this"
line. None of the bank's packs is a document or essay grammar: the nearest, `atomic-age`, is retro print and
`frontier-survey` is a game site. Without a pack the next report starts from zero and re-learns the same
traps (a Latin book serif given mixed CJK copy; a faint grey used for small text; a figure whose text is
measured against a grid pattern).

## What Changes

- **Style pack `institute-essay`** in `skill/tools/template-bank/styles/institute-essay/style.json` in the
  existing `design-pipeline.template-bank-style.v1` shape: a serif role (Source Serif 4, Noto Serif SC) and a
  sans role (Inter, Noto Sans SC) with catalog fallbacks, the measured palette (ivory, ink, secondary and faint
  greys, paper card, clay, five data hues used only inside figures), layout grammar with the measured numbers,
  materials (graph paper, a crayon fill filter and a crayon line filter with five hand-drawn line icons, a seeded pixel burst), motion grammar, checks with guidance
  (the faint grey is for large type only), provenance ("borrow grammar, never assets") and examples. It names
  no organisation and uses none of the original proprietary faces, logos or wordmarks: the lineage is the
  generic "AI research institute long-form explainer / research essay pages".
- **Six templates** rendered from parameters with original copy: `cover.essay-hero` (1600 x 900; `seed`,
  `density` of the pixel burst), `card.essay-finding` (three crayon bars from `value_1..3`, legend,
  footnote, how-to-read line), `card.essay-note-figure` (graph-paper figure, sticky note, legend),
  `card.essay-pullquote`, `doc.essay-scenarios` (three scenario cards with swatch rows) and `card.essay-flow` (a paper band of 3-5
  hand-drawn crayon-line icons joined by clay arrows with a label slot under each; `count`, `icon_start`).
- **HTML kit** `examples/institute-essay-report-kit/`: one self-contained long-read page on the same grammar
  (light and dark theme, 640 px column, seeded burst, crayon bars, crayon-line flow diagram, fan chart, scenario cards, timeline,
  footnotes, a scrollytelling stage of analyst-task tiles) with motion (the burst pops in and breathes, crayon
  lines draw themselves, values count up, the fan reveals left to right, tiles recolour per scroll step; all off
  under `prefers-reduced-motion`) with a README, referenced from the pack and `template-bank.md`.
- No change to `template check`, its rules, schemas, gates or CLI flags.

## Capabilities

- `design-pipeline`: the template bank gains one style pack and six templates; the examples gain one kit.

## Reuse

- `template list|render|check`, the style and manifest schemas, `Doc.text`/`Doc.zone`/`Doc.def`, `rbox`, `rng`
  and `invalid` from `layout-kit.cjs`, `measure.textWidth` for pill widths, the `BankError` codes and exit
  codes 0 / 2 / 1; `template check --browser` on the kit page.

## Impact

- New: `tools/template-bank/layouts-essay.cjs`, `styles/institute-essay/style.json`, six template folders,
  `tests/template-institute-essay.test.cjs`, `examples/institute-essay-report-kit/`.
- Changed: `bank.cjs` (layout registry list), `references/template-bank.md`, `package-resources.json`,
  `scripts/test-manifest.json`, `CHANGELOG.md`; counts in `tests/template-bank.test.cjs` and
  `tests/template-style-pack.test.cjs`.
