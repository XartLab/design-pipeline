## ADDED Requirements

### Requirement: Template bank ships the index-explorer pack

The template bank SHALL ship the `index-explorer` style pack. It SHALL name its case and a generic lineage without any organisation, product or logo name, state "borrow grammar, never assets", give every font role a catalog family with a fallback, carry the tile-ink rule as guidance and list the HTML kit as its example.

#### Scenario: List the pack

- **WHEN** `template list --style index-explorer` runs
- **THEN** it SHALL exit 0 with the pack's font roles, grammar, materials, motion and its six templates.

#### Scenario: Fallbacks

- **WHEN** the pack's font roles are read
- **THEN** every stack SHALL hold at least two families, one of them in `references/fonts/catalog.json`.

### Requirement: Index-explorer templates render original copy and pass both halves of the check

The `cover.index-hero`, `card.index-tilemap`, `card.index-ranking`, `card.index-stats`, `card.index-trend` and `card.index-region` templates SHALL render from parameters with original copy and no proprietary face, logo, wordmark, map file or data. Default renders SHALL pass the static check at every listed size, in both themes and for seeded variations, and the browser check.

#### Scenario: Default and seeded renders

- **WHEN** each template renders at its listed sizes, in both themes and with seeds 1 to 50
- **THEN** each static check SHALL pass, and each default render SHALL pass `--browser`.

#### Scenario: Tile grid

- **WHEN** `card.index-tilemap` renders with any seed and any `focus` from 0 to 30
- **THEN** it SHALL draw 31 tiles with one short name each, split into four rank-quartile classes of 8, 8, 8 and 7 tiles, ring only the focus tile, and pass the static check.

#### Scenario: Values and bars agree

- **WHEN** `card.index-ranking` renders
- **THEN** it SHALL draw ten rows in descending order whose inline bars are scaled to `max`, with each value text derived from the same number as its bar.

#### Scenario: Delta signs

- **WHEN** `card.index-stats` gets a negative `delta_N`
- **THEN** its delta SHALL carry a down triangle and the coral mark, and a positive one an up triangle.

#### Scenario: Copy that does not fit

- **WHEN** `cover.index-hero` gets a title line of 30 characters
- **THEN** the check SHALL report `text-overflow` or `text-length` for that slot with a fix.

### Requirement: The HTML data-explorer kit is a self-contained example

The repository SHALL ship `examples/index-explorer-kit/index.html`, one self-contained Chinese data page on the pack's grammar with a README. Every number SHALL be generated in the page and labelled as sample data, and the map SHALL be a tile grid, not a geographic file.

#### Scenario: Browser check

- **WHEN** `template check examples/index-explorer-kit/index.html --browser` runs at 1440 and 390 wide
- **THEN** it SHALL report no findings.

### Requirement: The kit's motion settles and its data can be replaced

The kit's motion (tiles that fade and colour in, bars that grow, a line that draws, smooth filter transitions) SHALL settle to a final state under `prefers-reduced-motion`, and a `<details>` SHALL let the owner paste a CSV that replaces the sample data.

#### Scenario: Reduced motion

- **WHEN** the page loads with `prefers-reduced-motion: reduce`
- **THEN** tiles, bars, numbers and the chart line SHALL show their final state without animation.

#### Scenario: Own data

- **WHEN** a CSV with the header `date,province,sector,value` is applied
- **THEN** the page SHALL redraw the map, rankings, chart and table from it and mark its source as the owner's data; a CSV with another header SHALL show an error and change nothing.
