## ADDED Requirements

### Requirement: Template bank ships the brand-band pack

The template bank SHALL ship the `brand-band` style pack. It SHALL name its case and a generic lineage without any organisation, product or logo name, state "borrow grammar, never assets", give every font role a catalog family with a fallback, list materials recipes and list the HTML kit as its example.

#### Scenario: List the pack

- **WHEN** `template list --style brand-band` runs
- **THEN** it SHALL exit 0 with the pack's font roles, grammar, materials, motion and its six templates.

#### Scenario: Fallbacks

- **WHEN** the pack's font roles are read
- **THEN** every stack SHALL hold at least two families, one of them in `references/fonts/catalog.json`.

### Requirement: Brand-band templates render original copy and original pictures and pass both halves of the check

The `kv.band-hero`, `card.band-features`, `banner.band-black-statement`, `cover.band-article`, `card.band-social` and `banner.band-cta-row` templates SHALL render from parameters with original copy and no proprietary face, logo, wordmark or picture. Default renders SHALL pass the static check at every listed size, for every `subject` and `field` and for seeded variations, and the browser check.

#### Scenario: Default and seeded renders

- **WHEN** each template renders at its listed sizes, every subject 0 to 7 on every field, and with seeds 1 to 50
- **THEN** each static check SHALL pass, and each default render SHALL pass `--browser`.

#### Scenario: Copy that does not fit

- **WHEN** `kv.band-hero` gets a title line of 24 characters
- **THEN** the check SHALL report `text-overflow` or `text-length` for that slot with a fix.

#### Scenario: Picture and field

- **WHEN** a template renders with `--param subject=1 --param field=sky`
- **THEN** the picture's accents SHALL NOT use the field's own hue, and no text SHALL sit on the field or the picture.

### Requirement: The illustration kit draws eight original subjects as marker ribbons

`illustrations-band.cjs` SHALL provide eight deterministic subjects (hand-graph, seedling, book, magnifier, spark-hands, path, candles, compass), each a set of filled stroke ribbons of varying width, each with a centre line, and flat misregistered fills, with no constant-width `stroke`.

#### Scenario: Deterministic ribbons

- **WHEN** a subject is generated twice
- **THEN** the output SHALL be identical, every stroke SHALL be a closed polygon with a centre line, and a ribbon's width SHALL vary along its length.

### Requirement: The HTML product-site kit is a self-contained example

The repository SHALL ship `examples/brand-band-site-kit/index.html`, one self-contained product page on the pack's grammar with a README, whose eight pictures are the illustration kit's own output, and the page SHALL pass the browser half of `template check`. Its motion (strokes that draw in on scroll, fade-up blocks, card lift, nav colours over a black band) SHALL settle to a final state under `prefers-reduced-motion`.

#### Scenario: Browser check

- **WHEN** `template check examples/brand-band-site-kit/index.html --browser` runs at 1440 and 390 wide
- **THEN** it SHALL report no findings.

#### Scenario: Pictures come from the library

- **WHEN** the page is compared with the illustration kit
- **THEN** each of the eight subjects SHALL appear in the page exactly once, as the kit generates it.
