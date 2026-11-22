## MODIFIED Requirements

### Requirement: Interaction verification audits rendered UI craft

The existing interaction verifier SHALL accept an `audit` probe that measures the rendered page for
typography, contrast, overflow, clipping, target size, control spacing, alignment and nested radius
at declared viewports. Thresholds and selectors SHALL be probe inputs with documented defaults. Each
check SHALL report passed, failed, not-declared, not-applicable or indeterminate with a checked count.

An inline text link SHALL be exempt from target size when it shares its line run with painted,
visible text, or when it is the only content of its paragraph. A link separated from surrounding text
by a `<br>` or an in-flow block box SHALL NOT be exempt, and a link that shares its paragraph with
other content SHALL still be measured unless the line-run rule exempts it. The exemption applies to
target size only; control spacing and control inset keep the controls they measure today.

#### Scenario: A page violates measured craft rules

- **WHEN** `verify interaction` runs an audit probe against a page with failing measurements
- **THEN** each failure SHALL be a finding with its code, element selector, measured value,
  threshold, viewport and fix
- **AND** the verifier SHALL exit 2 and SHALL NOT record a gate pass.

#### Scenario: Evidence is unresolved

- **WHEN** text sits on a gradient, image or translucent background, or a declared selector matches
  no element
- **THEN** contrast SHALL report `indeterminate` with a fix to place the text on a measurable surface,
  or the check SHALL fail, and the audit SHALL fail
- **AND** no probe field SHALL suppress the result or mark the check as passed.

#### Scenario: An optional check is not declared

- **WHEN** a selector-based optional check has no declared selectors
- **THEN** it SHALL report `not-declared` in the audit coverage
- **AND** it SHALL NOT be reported as passed.

#### Scenario: An audit probe is malformed

- **WHEN** an audit probe has an unknown field, no `thresholds.fonts`, an empty selector, a
  non-positive threshold, a duplicate viewport, or a page that is not a local file inside the project
- **THEN** validation SHALL reject it before any browser starts
- **AND** existing motion and journey probes SHALL keep their current behavior.

#### Scenario: Paint over generated text on its own fill is unresolved

- **WHEN** generated `::before` or `::after` text on its own fill lies under another element, a
  positioned child of its host, or its host's other pseudo-element painted above it
- **THEN** contrast SHALL report `indeterminate` instead of a ratio against that fill
- **AND** generated text on its own fill that is transformed, offset by relative or sticky
  positioning, or otherwise cannot be placed SHALL report `indeterminate` as well.

#### Scenario: Generated text is measured where its margins place it

- **WHEN** the margins of an absolute pseudo-element move its generated text off its host
- **THEN** contrast SHALL be measured against the background behind the moved box.

#### Scenario: An over-constrained pseudo-element does not widen a target

- **WHEN** a control's absolute `::before` or `::after` has a size, margins and insets that
  over-constrain each other
- **THEN** target size SHALL measure the control without that pseudo-element
- **AND** a pseudo-element whose insets and margins resolve SHALL widen the target to its border box,
  on an inline control on one line as on a block.

#### Scenario: A link across a line break is not inside a sentence

- **WHEN** an inline link is separated from the surrounding text by a `<br>` or an in-flow block box
- **THEN** that text SHALL NOT exempt the link from target size and control spacing
- **AND** a link inside a sentence that merely wraps SHALL stay exempt.

#### Scenario: A prose link is the only content of its paragraph

- **WHEN** an inline text link is the only content of its paragraph
- **THEN** it SHALL be exempt from target size, because the paragraph's line box constrains it
- **AND** a link that shares its paragraph with other content SHALL still be measured, unless the
  sentence rule above exempts it.

## ADDED Requirements

### Requirement: Public CLI commands are documented with a usage line

The skill entry and its maintained references SHALL give every top-level `designer-pipeline` command
one usage line, so an agent can run a command without discovering its flags by trial and error.

#### Scenario: A command has no guide

- **WHEN** `plan`, `resume`, `explain-block`, `package`, `patterns`, `ui-ir`, `design-code-map`,
  `art-motion`, `diligence` or `style-signals` is missing its usage line
- **THEN** the repository documentation check SHALL fail and name the command.

### Requirement: The Windows name-scope and upstream-path checks stay portable

The `reference-name-scope` and `upstream-path` tests SHALL run on Windows and on case-sensitive
file systems: a case-insensitive file system SHALL NOT collapse two fixtures into one, and a
snapshot path SHALL name the file that failed in the platform's own path form.

#### Scenario: The checks run on Windows

- **WHEN** the repository QA runs on Windows
- **THEN** both tests SHALL pass without skipping
- **AND** no shared working tree outside the managed checkout SHALL be modified.
