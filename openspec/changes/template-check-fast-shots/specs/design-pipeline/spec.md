## ADDED Requirements

### Requirement: Template check measures a page quickly without changing what it measures

The browser half of `template check` SHALL take its screenshots inside the viewport it sized to the canvas, SHALL take each measurement state once over all text units rather than once per unit, and SHALL share a state or a screenshot between units only where their regions do not touch. Its rules, thresholds, finding codes and report shape SHALL NOT change, and the same page SHALL produce the same findings and contrast values as before.

#### Scenario: A tall kit page

- **WHEN** a page 8000 px tall with about 120 text units is checked at 1440 wide
- **THEN** the check SHALL finish in well under one minute on a 2-core machine, with the findings and per-unit contrast it reported before.

#### Scenario: Touching regions are measured apart

- **WHEN** a small text sits over a giant glyph, so their regions overlap
- **THEN** they SHALL NOT share a measurement batch, and the small text's contrast SHALL be measured against the glyph as before.
