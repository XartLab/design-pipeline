## ADDED Requirements

### Requirement: Template bank ships the circuits-paper pack

The template bank SHALL ship the `circuits-paper` style pack. It SHALL name its case and a generic lineage without any organisation, product or logo name, state "borrow grammar, never assets", give every font role a catalog family with a fallback, list materials recipes, carry the faint-grey rule as guidance and list the HTML kit as its example.

#### Scenario: List the pack

- **WHEN** `template list --style circuits-paper` runs
- **THEN** it SHALL exit 0 with the pack's font roles, grammar, materials, motion and its five templates.

#### Scenario: Fallbacks

- **WHEN** the pack's font roles are read
- **THEN** every stack SHALL hold at least two families, one of them in `references/fonts/catalog.json`.

### Requirement: Circuits-paper templates render original copy and pass both halves of the check

The `cover.circuits-title`, `card.circuits-figure`, `card.circuits-features`, `card.circuits-graph` and `doc.circuits-contents` templates SHALL render from parameters with original copy and no proprietary face, logo or wordmark. Default renders SHALL pass the static check at every listed size, in light and dark and for seeded variations, and the browser check.

#### Scenario: Default and seeded renders

- **WHEN** each template renders at its listed sizes, in both themes and with seeds 1 to 50
- **THEN** each static check SHALL pass, and each default render SHALL pass `--browser`.

#### Scenario: Graph grid

- **WHEN** `card.circuits-graph` renders with `--param layers=L` and `--param cols=C`
- **THEN** it SHALL draw L x C x 4 nodes with C `tok_N` tiles and L `layer_N` labels, the same seed SHALL give the same graph, and a `--set` for a slot that is not drawn SHALL fail with `OPTION_VALUE_INVALID`.

#### Scenario: Token rows and derived values

- **WHEN** `card.circuits-features` renders with `--param rows=3`
- **THEN** each example SHALL be drawn as one text per token with highlight rects in `hot_lo`, `hot_mid` or `hot_hi` and black text on every highlight, no fourth example SHALL be drawn, and `--set val_1=...` SHALL fail because the value is derived from the seed.

#### Scenario: Copy that does not fit

- **WHEN** `cover.circuits-title` gets a title line far past its budget, or `card.circuits-features` gets an example whose tokens run past the strip
- **THEN** the check SHALL report `text-overflow` or `text-length` for that slot with a fix.

### Requirement: The HTML paper kit is a self-contained example

The repository SHALL ship `examples/circuits-paper-kit/index.html`, one self-contained interactive research-paper page on the pack's grammar with a README, and the page SHALL pass the browser half of `template check` at 1440 and 390 wide.

#### Scenario: Content

- **WHEN** the page is read
- **THEN** it SHALL carry a byline, contents, margin notes that fall inline on narrow screens, at least two interactive figures, equations and footnote and citation previews, and label every number as a sample.

#### Scenario: Motion

- **WHEN** the page loads under `prefers-reduced-motion`
- **THEN** every figure SHALL be in its final state.

#### Scenario: Browser check

- **WHEN** `template check examples/circuits-paper-kit/index.html --browser` runs at 1440 and 390 wide
- **THEN** it SHALL report no findings.
