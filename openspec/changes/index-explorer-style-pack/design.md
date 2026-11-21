# Design

## Decisions (made without asking)

- **Named by the grammar, never the source**: `index-explorer`; templates are named by what they are
  (`cover.index-hero`, `card.index-tilemap`). No file, test, commit or PR names an organisation, product, logo
  or wordmark; the lineage line is a generic genre description ("AI-usage economic index data explorer: a public
  research data site with a map, occupation rankings and filters"). The reference pages stay with the owner;
  the pack carries only numbers measured on them. The test forbids organisation and model names in every pack
  and kit file.
- **Measured numbers, not taste** (captured privately 2026-11-21, not shipped): ground #FAF9F5, ink #141413,
  secondary #5E5D59, row hairlines #D1CFC5, card border #C9C4C4; map panel #F5F4ED radius 8; legend and stat
  cards white with a 1 px border, radius 16, padding 12 and 24; tooltip plate #3D3D3A radius 8 padding 16,
  shadow 0 8 24 at 25% black, serif 16 / 20 name in the ground colour over a 1 px #5E5D59 rule, sans 12 rows.
  Four-class sequential scale by rank quartile (leading top 25%, upper middle, lower middle, emerging):
  #388F76, #59B295, #89D1B9, #BEE5D8. Tile map: square tiles 65 on a 69 pitch (4 gap, radius 0), a sans 23 / 500
  label in ink on every tile, a 2 px dark outline on hover, a hit rectangle per tile. Type: hero serif 80 / 88
  (second line weight 300), region names serif 48 / 57.6, numerals serif 32 / 38.4, tabs serif 18 / 27.9 weight
  500 with a 2 px underline on the active one, ranking row 23 high with a 1 px bottom rule, mono 13 rank
  number, sans 14 name, mono 14 value, inline bar box 71 x 16 with a 1 px ink border and a green fill, labels
  and captions sans 12-14, date label mono 13 uppercase. Detail panel: a rank strip of one 10 x 24 cell per region
  (1 gap; the region's own cell #6A9BCC), an index bar 24 high with an "expected: 1" mark, two tabs over a
  ten-row list with mono percentages, a treemap of pastel tiles on 1 px gaps. Filters: a 36 px search field
  (radius 8), two bottom-ruled selects 140 x 23 with a small bold label, a three-dot legend, a fixed left column of
  numbered links (mono 01..06 over sans 13). Layout: left column 260-313 wide, a card column and a wide map
  column; section rhythm 48 above and 24 below a section head; a report page keeps a 720 column and 865 figures
  with a sans 13 / 20 caption.
- **Own faces, not theirs**: the originals are proprietary. The pack names Source Serif 4 (serif), Inter (sans)
  and JetBrains Mono (mono), with Noto Serif SC and Noto Sans SC for CJK; every stack holds a catalog family.
  Fonts are named, not bundled; `--font-dir` embeds them. Mono holds Latin only (ranks, values, deltas, date
  label); the kit sets CJK labels in the sans or serif role.
- **Roles are named `serif`, `sans` and `mono`**: the layout engine wraps and measures a role literally named
  `serif` with the wide serif model, the one the static check applies to a family whose name contains Serif, and
  a mono role with a fixed advance, so wrapped slots and the check agree.
- **The map is a table, not a file**: 31 units on an 8 x 8 grid, each `[short name, full name, column, row]`, one
  character per tile in the kit and in `layouts-index.cjs`. No coastline, no geographic data and no proprietary
  map is copied or fetched. The classes are by rank quartile of seeded values, 8, 8, 8 and 7 tiles, so every seed
  shows all four classes.
- **Tile names stay in the fixed dark ink**: ink #141413 on the deepest green #388F76 is 4.7:1, on the lighter
  classes more, so one ink works for all four classes and for both themes (the dark theme lightens the page, not
  the scale). Coral is for marks only (a falling delta, an end dot, the third series); a categorical tile uses
  `salmon` #E8877A, a step off the accent, so the treemap does not spend the 22% accent budget.
- **Bar values are parameters, not slots**: ranking rows take `top`, `spread` and `max` and derive each bar and
  its value text from one number; stat deltas take their triangle from the sign of `delta_N`. A bar and its
  number cannot disagree.
- **Browser-check cost shaped the layout code**: the check measures each text unit with several screenshots
  (about 0.35 s a unit on a 2-core box), so a ranking of 20 separate `<text>` took 71 s. `marks()` in
  `layouts-index.cjs` emits a `<g data-chk>` holding separate `<text>` elements (one unit per column or row of
  labels); a `<tspan>` with x or y is `unsupported-geometry`, so tspans were not an option. Ranking is ten rows,
  five per column; the region list is six items; the default renders now check in 7-8 s each and the test runs
  the six renders plus the dark tilemap in two parallel Chromes. The contrast of a unit is the 10th percentile of
  its run colours against the ground over its whole shrunk ink box, so a unit that spans bars or tiles can fail
  falsely: units are cut to labels and numbers, never to a figure.
- **The kit page keeps units small for the same reason**: axis labels are HTML in one `data-chk` unit; a
  ranking column is four stacks (rank, name, bar, value) rather than a grid of cells; "how to read" and the
  footnotes are one unit per paragraph. A `data-chk` that contains other `data-chk` is only a container (its
  own text goes unmeasured), so no unit nests. A closed `<details>` body is measured at stale off-canvas
  positions, so the CSV panel's body is injected lazily from a `<template>` when the panel opens.
- **Motion on the kit, settled for the check**: tiles fade and colour in on an IntersectionObserver reveal, bars
  grow, stat numbers count up, the chart line draws with `pathLength` and a dash offset, filter changes
  cross-fade; `prefers-reduced-motion` (CSS block and `matchMedia` in script) shows the final state. The test
  launches Chrome with `--force-prefers-reduced-motion` so scripted motion is in its final state.
  `page-check.cjs` is unchanged. Section heights use `min(100vh, ...)` where a viewport unit appears, because the
  check sets the viewport to the whole page height.
- **The chart is real pixels**: a ResizeObserver redraws the SVG at the container width, so labels never scale
  and the crosshair maps pointer to day by plain arithmetic; keyboard arrows move it.
- **Own data, safely**: the pasted CSV (`date,province,sector,value`) is parsed in the page only, validated
  (header, a date and a positive number on each row; rows with an unknown province are skipped and listed), then replaces the generated table; a bad file shows a message and
  changes nothing. Nothing is uploaded and nothing is stored.
- **Sample data is labelled**: the page marks its data as 示例数据 and its source tag reads SAMPLE DATA until a CSV is applied (then YOUR CSV);
  the methodology note says the numbers are generated from a seed and are not market data or advice.
- **Templates are the parts, not the page**: a data page is a scrolling app with state; the bank keeps the six
  parts that recur (hero, tile map with legend and tooltip, ranking, stat cards, trend panel, region detail).
  Filters, the sortable table, how-to-read and the CSV box live in the kit.
- **Fast checks**: each kit width runs once in its own Chrome, in parallel with the other width and the static
  tests (`tests/helpers/kit-browser-check.cjs`); the default renders share Chromes in process.

## Evidence

- Measurement: computed styles of both reference pages in Chrome on 2026-11-21 (private), numbers above.
- Templates: every default render, each listed size, both themes, 50 seeds and all 31 focus tiles pass the
  static check; the default renders pass `template check --browser`.
- Kit: `template check examples/index-explorer-kit/index.html --browser` at 1440 (page height 5437) and 390
  (page height 7238) wide, no findings in either, about 25 s together.
- Interaction, driven in Chrome at 1440: hover tooltip, tile select, region and sector filters, sort, show all,
  CSV demo applied, a malformed CSV refused; no console errors.

## Compatibility

Additive. No schema, rule, gate, receipt or CLI change; other templates' renders are unchanged.
