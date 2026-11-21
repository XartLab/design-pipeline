## ADDED Requirements

### Requirement: Template bank ships the devlog-terminal pack

The template bank SHALL ship the `devlog-terminal` style pack. It SHALL name its case and a generic lineage without any organisation, product or mascot name, state "borrow grammar, never assets", give every font role a catalog family with a fallback, keep proprietary faces and the reference mascot out, carry the 64 px test as guidance and list the case screens kept as examples.

#### Scenario: List the pack

- **WHEN** `template list --style devlog-terminal` runs
- **THEN** it SHALL exit 0 with the pack's font roles, grammar, materials, motion and its five templates.

#### Scenario: Fallbacks

- **WHEN** the pack's font roles are read
- **THEN** every stack SHALL hold at least three families, one of them in `references/fonts/catalog.json`.

### Requirement: Devlog-terminal templates keep the measured grammar and pass both halves of the check

The `ui.devlog-index`, `ui.devlog-article`, `ui.devlog-article-header`, `card.devlog-fig` and `banner.devlog-dotfield` templates SHALL render from parameters with original copy, use the clay accent only as square tiles carrying a pixel glyph, never set dim grey as text, and set a mono slot given CJK copy whole in the sans role. Default renders SHALL pass the static check at every size and for seeded variations, and the browser check.

#### Scenario: Default and varied renders

- **WHEN** each template renders with its defaults, `ui.devlog-index` with `rows=6` and `rows=8`, and `ui.devlog-article` with `progress=0` and `progress=100`
- **THEN** each static check SHALL pass, and each default render SHALL pass `--browser`.

#### Scenario: Clay only as tiles

- **WHEN** any default render is read
- **THEN** every clay-filled element SHALL be a square rect no wider than 192 units and none SHALL be text.

#### Scenario: Rows and derived slots

- **WHEN** `ui.devlog-index` gets `--param rows=6 --set row_title_7=x`, or `ui.devlog-article` gets `--set percent=5%`
- **THEN** the render SHALL exit 1 with `OPTION_VALUE_INVALID` and a fix.

#### Scenario: A seed is a field

- **WHEN** `banner.devlog-dotfield` renders twice with the same `seed`, then with another
- **THEN** the first two SHALL be byte-identical, the third SHALL differ, and no dot SHALL lie inside the mascot disc.
