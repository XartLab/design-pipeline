# Design

## Decisions (made without asking)

- **Named by the grammar, never the source**: `circuits-paper`; templates are named by what they are
  (`card.circuits-graph`, `card.circuits-features`). No file, test, commit or PR names an organisation,
  product, logo or wordmark; the lineage line is a generic genre description ("Distill-lineage" names a
  publishing format, not an organisation). The three reference pages stay with the owner; the pack carries
  only numbers measured on them.
- **Measured numbers, not taste** (computed styles in Chrome, captured privately 2026-11-21, not shipped):
  - Reading column 704 px at a 1920 px viewport, starting at x 601. Body 16.96 / 28.83 px (line height 1.7),
    colour 80% black. h1 50 / 55 px weight 700 black; h2 36 / 45 px weight 600 (margin-top 32 px); h3 26 / 36 px
    weight 700 in 60% black; h4 16 px weight 600 uppercase; footnote and caption text 12.8-13 px; the footnote
    list 12.8 / 21.8 px in 50% black. Links: 1 px underline at 40% black; code on #FAFAFA.
  - Byline: a full-width container between two 1 px rules (10% black), 203 px tall at y 278; kickers 9.6 px
    uppercase 50% black; names 12.8 / 19.2 px; the authors take 570 px at the left of the column; affiliation
    (x 1191, y 299) and publication date (y 369) stack in a 114 px column at its right; contribution markers
    are 10.24 px superscripts.
  - Table of contents: 516 px block at x 53, a 1 px right rule (10% black), padding-right 51 px; items 13 / 19.5 px,
    top-level weight 600 and nested 400, all 80% black; its heading is 26 px bold 60% black. On the newer paper
    the contents become a fixed 13 px select pinned top left (17 options); the index page lists papers with a 12 px
    uppercase 60% black date column at x 553 and a 660 px title column at x 693, the page ground #FAF9F5.
  - Margin gutter: the first gutter figure sits at x 1337, 113 px wide, 32 px right of the text column; wide
    figures are 767-947 px wide on the 2021 paper and 1043 px wide on the 2025 paper; captions 13 px 80% black
    with a bold "Figure N:" lead-in. The style sheets' width breakpoints are 600, 768, 1000, 1024, 1180 and
    1200 px.
  - Footnote hover card: pale, text about 12-13 px, blue citation numbers; the footnote marker is a superscript.
  - Figures (2025 paper): node circles fill #F6F6F3 with a 2 px #B8B6AD outline; faint edges 0.5 px #B8B6AD;
    active nodes #633636 with edges #C46686 (0.5-3 px); a selected node ring #9D8DE3; error nodes are diamonds;
    token boxes #E6E3D6 (text #706D5C on the darker tile family) with Roboto Mono 17 px; layer labels Roboto 14 px
    #262624; neuron labels 16 px #1A1A1A; feature visualisation highlights run through #FFAE72, #FF8D47 and
    #FF6927 behind monospace tokens in a bordered box.
  - Tile grid on the paper's front: 180 x 261 px white cards, 1 px #E5E5E5 border, radius 5, a 13 px bold caption.
  - Page ground: white on both papers (the index uses #FAF9F5); links on the index #333; the contents links on
    the newer paper rgb(0, 66, 118) = #004276.
- **Own faces, not theirs**: the original thread sets its index in proprietary faces and its papers in the
  system stack and Roboto. The pack names IBM Plex Sans (a plain humanist grotesque with the same colour), Roboto
  Mono (the figures' own face is an open Apache-2.0 / OFL family, named as an open substitute, not bundled) and
  STIX Two Text for equations, with Noto Sans SC and Noto Serif SC for CJK; every stack holds a catalog family, so
  the fallback is always a family the catalog knows. Fonts are named, not bundled; `--font-dir` embeds them.
- **Faint grey is for large type only**: #808080 on white is 3.9:1, which passes the 3:1 of large text and fails
  4.5:1, so every small line (kicker, caption, margin note, legend) uses #666666 (5.7:1). The three oranges carry
  black text only (8.3:1 on #FF6927); the dark theme keeps the oranges and black text on them (`onhot`).
- **Token strips the check can read**: the checker rejects a tspan with its own x, so a token row is one slot
  value (tokens separated by spaces) drawn as one `<text>` per token, each with the slot name, its own box and its
  own x; highlights are plain rects under them. A row that runs past its strip shrinks its last box and fails
  `text-overflow` with a fix instead of drawing outside.
- **Derived values**: the top-activations list values come from the seed (`val_1..5`, declared derived), so a
  bar and its number cannot disagree; `card.circuits-graph` takes layers, columns and seed, and unused
  `tok_N` / `layer_N` slots are "not drawn".
- **Array defaults are rotated by one**: the bank indexes a repeated slot's default with `array[index % length]`
  and slot names count from 1, so the manifests store each list rotated right by one (as `card.essay-flow` does).
- **The HTML kit copies the grammar, does not extend the templates**: it is one file, no build, with fonts from a
  CDN and local fallbacks, equations as HTML with serif italics (no KaTeX: the page stays offline-safe), and
  every figure number a labelled sample. Labels of the interactive figures are HTML (token tiles under the
  graph, layer labels in a gutter column, the output tile overlaid), so on a phone they stay readable instead of
  shrinking with the SVG.
- **Margin notes**: a `.blk` grid of column and gutter; below 1100 px the grid collapses and the note follows
  its paragraph with a mauve rule on its left. The contents become a collapsed `<details>` list.
- **Motion on the kit, settled for the check**: `prefers-reduced-motion` shows the final state (a `rm` class set
  before first paint, plus an `!important` media rule). The test launches Chrome with
  `--force-prefers-reduced-motion`; `page-check.cjs` is unchanged.
- **Fast checks**: the page has 77 text units (the check screenshots each): byline, contents, token strips, the
  graph's token row, readouts, notes and the ordered lists are `data-chk` groups that own their descendants;
  each kit width runs in its own Chrome in parallel, and the default renders share one Chrome
  (`tests/helpers/kit-browser-check.cjs`); the test file runs in under a minute.

## Evidence

- Measurement: computed styles of the three pages in Chrome on 2026-11-21 (private), numbers above.
- Templates: every default render, each listed size, light and dark, and 50 seeds pass the static check; the
  default renders and the dark variants of three pass `template check --browser`.
- Kit: `template check examples/circuits-paper-kit/index.html --browser` at 1440 and 390 wide, 0 findings.

## Compatibility

Additive. No schema, rule, gate, receipt or CLI change; other templates' renders are unchanged.
