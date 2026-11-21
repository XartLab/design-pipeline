# circuits-paper: an interactive interpretability research paper thread as a style pack and an HTML paper kit

## Why

The owner named a public research thread whose papers are interactive scientific articles (a Distill-lineage
grammar) and asked to learn its look for reports and later templates. We captured and measured three of its
pages in Chrome (the thread's index, a long 2021 framework paper and a 2025 attribution-graph paper; computed
styles, 2026-11-21; the captures stay private and nothing from them is shipped). The grammar is plain and
precise: a white page, three steps of ink, one grotesque, a wide byline grid, a reading column with a sticky
contents list on its left and a margin gutter on its right, numbered captions, and figures you can touch:
beige nodes with weighted mauve edges, token strips lit by activation. The bank has an editorial pack
(`institute-essay`) and a terminal blog pack (`devlog-terminal`), but no scientific-paper grammar: without one
the next paper starts from zero and re-learns the same traps (a margin note that has no mobile fallback, a
diagram whose labels shrink below 10 px on a phone, an activation highlight with grey text on it).

## What Changes

- **Style pack `circuits-paper`** in `skill/tools/template-bank/styles/circuits-paper/style.json` in the
  existing `design-pipeline.template-bank-style.v1` shape: three font roles through the catalog (`sans`: IBM
  Plex Sans, Noto Sans SC; `mono`: Roboto Mono, Noto Sans SC; `serif`: STIX Two Text, Noto Serif SC), the
  measured palette (white, three inks, rule grey, beige node and tile, mauve, maroon, a lavender ring, link
  blue, three oranges), layout grammar with the measured numbers, procedural materials, motion grammar, checks
  with guidance, provenance ("borrow grammar, never assets") and the kit as its example. It names no
  organisation and uses none of the original faces, logos or wordmarks; the lineage is the generic
  "interactive interpretability research paper thread, a Distill-lineage scientific article".
- **Five templates** rendered from parameters with original copy: `cover.circuits-title` (title, deck, byline
  grid, marker line, abstract), `card.circuits-figure` (residual-stream schematic, numbered caption, margin
  note; `layers`, `tokens`), `card.circuits-features` (token strips highlighted in three oranges, ranked
  top-activations list; `seed`, `rows`), `card.circuits-graph` (layered nodes, weighted edges, legend; `seed`,
  `layers`, `cols`) and `doc.circuits-contents` (sticky contents, article column, footnote card; `count`,
  `active`), each with `theme=dark`.
- **HTML kit** `examples/circuits-paper-kit/`: one self-contained Chinese paper page on the same grammar
  (byline, contents with the section in view marked, margin notes that fall inline below 1100 px, a feature
  browser, an attribution graph with hover focus and an edge-pruning slider, a sparsity curve with a slider,
  equations in HTML, footnote and citation previews; every number a labelled sample) with motion (figures
  rise in, edges draw themselves, bars grow, highlights fade in per token; all off under
  `prefers-reduced-motion`) and a README, referenced from the pack and `template-bank.md`.
- No change to `template check`, its rules, schemas, gates or CLI flags.

## Capabilities

- `design-pipeline`: the template bank gains one style pack and five templates; the examples gain one kit.

## Reuse

- `template list|render|check`, the style and manifest schemas, `Doc.text`/`Doc.zone`/`Doc.def`/`familyFor`/
  `slotAttrs`, `measure.textWidth`, the `BankError` codes and exit codes 0 / 2 / 1; `template check --browser`
  on the kit page; the shared `tests/helpers/kit-browser-check.cjs`.

## Impact

- New: `tools/template-bank/layouts-circuits.cjs`, `styles/circuits-paper/style.json`, five template folders,
  `tests/template-circuits-paper.test.cjs`, `examples/circuits-paper-kit/`.
- Changed: `bank.cjs` (layout registry list), `references/template-bank.md`, `package-resources.json`,
  `scripts/test-manifest.json`, `CHANGELOG.md`; counts in `tests/template-bank.test.cjs` and
  `tests/template-style-pack.test.cjs`.
