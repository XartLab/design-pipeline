# index-explorer: a public research data explorer's grammar as a style pack and an HTML data-page kit

## Why

The owner named two public pages in the genre of "AI-usage economic index data explorer: a public research data
site with a map, occupation rankings and filters" and asked to learn their look for a market-hotspot index page
of a quant trading project. We captured and measured them in Chrome (computed styles, 2026-11-21; the captures
stay private and nothing from them is shipped). The grammar is calm and numeric: an ivory page, serif for names,
titles and numerals against a neutral sans for every label and mono for ranks and values, a four-class green scale
on a square tile map, white stat cards, hairline-ruled rankings with inline bars, a detail panel with a rank strip
and an index bar, and a tooltip on a dark plate. None of the bank's packs is a data-explorer grammar: the nearest,
`institute-essay`, is a long-read with crayon figures. Without a pack the next data page starts from zero and
re-learns the same traps (a map that needs a geographic file; a label on a mid-green tile whose contrast flips
with the theme; a figure whose axis labels are measured against bars).

## What Changes

- **Style pack `index-explorer`** in `skill/tools/template-bank/styles/index-explorer/style.json` in the
  existing `design-pipeline.template-bank-style.v1` shape: serif, sans and mono roles (Source Serif 4, Inter,
  JetBrains Mono, with Noto Serif SC and Noto Sans SC for CJK) with catalog fallbacks, the measured palette
  (ivory, ink, secondary, hairlines, panel and card grounds, the four-class green scale, blue, coral and seven
  categorical tile hues, the tooltip plate), layout grammar with the measured numbers, materials, motion grammar,
  checks with guidance (tile names stay in a fixed dark ink; coral is for marks), provenance ("borrow grammar,
  never assets") and examples. It names no organisation and uses none of the original proprietary faces, logos,
  wordmarks, map files or data: the lineage is the generic "AI-usage economic index data explorer".
- **Six templates** rendered from parameters with original copy: `cover.index-hero` (1600 x 900; two-line
  title, deck, pills and a mini tile grid; `seed`), `card.index-tilemap` (31-unit tile grid, legend card and a
  tooltip; `seed`, `focus`), `card.index-ranking` (ten rows with inline bars derived from `top`, `spread`,
  `max`), `card.index-stats` (four stat cards with delta triangles from the sign of `delta_N` and sparklines),
  `card.index-trend` (a panel with tabs, filters and a three-series line chart; `active`, `volatility`) and
  `card.index-region` (a detail panel with a rank strip, an index bar, a six-row list and a treemap; `rank`,
  `index`). Every template takes `theme=dark`.
- **HTML kit** `examples/index-explorer-kit/`: one self-contained Chinese data page, 「市场热点指数」 for a quant
  trading project, on the same grammar: hero, stat cards, a tile map of Chinese provinces (a table of 31 units,
  not a geographic file), sector rankings, a time series with tabs and a crosshair, region / sector / period
  filters, a sortable table, tooltips, a "how to read" note, methodology footnotes and a `<details>` where the
  owner pastes their own CSV to drive the page. Every number is generated in the page from a seed and labelled
  as sample data. Motion (tiles fade and colour in, bars grow, the line draws, smooth filter transitions; all off
  under `prefers-reduced-motion`) with a README, referenced from the pack and `template-bank.md`.
- No change to `template check`, its rules, schemas, gates or CLI flags.

## Capabilities

- `design-pipeline`: the template bank gains one style pack and six templates; the examples gain one kit.

## Reuse

- `template list|render|check`, the style and manifest schemas, `Doc.text`/`Doc.zone`/`Doc.def`, `rbox`, `rng`
  and `invalid` from `layout-kit.cjs`, `measure.textWidth`, the `BankError` codes and exit codes 0 / 2 / 1;
  `template check --browser` on the kit page; `tests/helpers/kit-browser-check.cjs` for the kit test.

## Impact

- New: `tools/template-bank/layouts-index.cjs`, `styles/index-explorer/style.json`, six template folders,
  `tests/template-index-explorer.test.cjs`, `examples/index-explorer-kit/`.
- Changed: `bank.cjs` (layout registry list), `references/template-bank.md`, `package-resources.json`,
  `scripts/test-manifest.json`, `CHANGELOG.md`; counts in `tests/template-bank.test.cjs` and
  `tests/template-style-pack.test.cjs`.
