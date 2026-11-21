## ADDED Requirements

### Requirement: Template bank ships the institute-essay pack

The template bank SHALL ship the `institute-essay` style pack. It SHALL name its case and a generic lineage without any organisation, product or logo name, state "borrow grammar, never assets", give every font role a catalog family with a fallback, list materials recipes, carry the faint-grey rule as guidance and list the HTML kit as its example.

#### Scenario: List the pack

- **WHEN** `template list --style institute-essay` runs
- **THEN** it SHALL exit 0 with the pack's font roles, grammar, materials, motion and its five templates.

#### Scenario: Fallbacks

- **WHEN** the pack's font roles are read
- **THEN** every stack SHALL hold at least two families, one of them in `references/fonts/catalog.json`.

### Requirement: Institute-essay templates render original copy and pass both halves of the check

The `cover.essay-hero`, `card.essay-finding`, `card.essay-note-figure`, `card.essay-pullquote` and `doc.essay-scenarios` templates SHALL render from parameters with original copy and no proprietary face, logo or wordmark. Default renders SHALL pass the static check at every listed size and for seeded variations, and the browser check.

#### Scenario: Default and seeded renders

- **WHEN** each template renders at its listed sizes and with seeds 1 to 50
- **THEN** each static check SHALL pass, and each default render SHALL pass `--browser`.

#### Scenario: Values and bars agree

- **WHEN** `card.essay-finding` gets `--param value_2=80`
- **THEN** its second bar SHALL be 80 / `max` of the track and its value text SHALL read `+80%`.

#### Scenario: Copy that does not fit

- **WHEN** `cover.essay-hero` gets a title line of 30 characters
- **THEN** the check SHALL report `text-overflow` or `text-length` for that slot with a fix.

### Requirement: The HTML long-read kit is a self-contained example

The repository SHALL ship `examples/institute-essay-report-kit/index.html`, one self-contained long-read page on the pack's grammar with a README, and the page SHALL pass the browser half of `template check`.

#### Scenario: Browser check

- **WHEN** `template check examples/institute-essay-report-kit/index.html --browser` runs at 1440 and 390 wide
- **THEN** it SHALL report no findings.
