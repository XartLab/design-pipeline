## ADDED Requirements

### Requirement: Tracked UI rule lists may be pinned as rule directories

A tracked UI rule source SHALL be pinned as a rule directory when its upstream ships one Markdown
file per rule. The coverage map SHALL hold one row per rule file, the row id SHALL be the rule file
basename, and the quoted rule text SHALL be the upstream index line. The upstream index and the
rule directory SHALL agree one to one: a rule file without an index row, an index row without a rule
file, and a repeated rule file SHALL each fail the maintenance refresh.

#### Scenario: Upstream adds a rule file

- **WHEN** the upstream adds a rule file and its index row
- **THEN** the pinned fixture SHALL list the new file and the map SHALL need a row for it
- **AND** the coverage test SHALL fail until that row exists.

#### Scenario: Upstream adds a rule file without an index row

- **WHEN** the upstream adds a rule file that the index does not mention
- **THEN** the maintenance refresh SHALL fail and name the file.

#### Scenario: Upstream renames or removes a rule file

- **WHEN** the upstream renames or removes a rule file
- **THEN** the pinned file list and the map SHALL disagree
- **AND** the coverage test SHALL fail and name the rule id.

### Requirement: Duplicate View Transition names are measured on the rendered page

The audit SHALL expose `audit.view-transition-names` and examine computed values on every visible
element. Duplicate authored names SHALL fail with one finding per name and the affected selectors.
A unique name SHALL pass; no authored names SHALL report `not-applicable`. The audit SHALL ignore
`none`, the browser-assigned `root` name on the root element, and per-element `match-element`.

#### Scenario: Two visible elements share a name

- **WHEN** an audited page gives two visible elements the same `view-transition-name`
- **THEN** the check SHALL fail with a finding naming both elements
- **AND** the gate SHALL report the failure.

#### Scenario: The names are unique

- **WHEN** an audited page gives one visible element a name and no other element the same name
- **THEN** the check SHALL pass.

#### Scenario: The page names no element

- **WHEN** an audited page has no `view-transition-name` on any visible element
- **THEN** the check SHALL report `not-applicable` with nothing checked.

#### Scenario: A hidden element repeats a visible name

- **WHEN** a hidden element carries the same `view-transition-name` as a visible one
- **THEN** the hidden element SHALL NOT take part and the check SHALL pass.

## MODIFIED Requirements

### Requirement: UI craft rules are project-owned

The pipeline SHALL keep one project-owned UI craft rule index that maps each audit code to its
sources and holds a deduplicated review checklist with stable, gap-free ids for rules the audit does not
measure, each row citing its sources. Source-level rules a rendered page cannot show SHALL be
checklist rows. The web review SHALL record checklist results as Component Conformance evidence. A
new checklist row SHALL be named in the QA checklist so the review records it.

#### Scenario: A reviewer checks an unmeasured rule

- **WHEN** the web review covers motion feel, focus, semantics, copy or states
- **THEN** it SHALL use the checklist ids from the rule index and record results in `qa.md`
- **AND** it SHALL NOT report them as Visual Acceptance.

#### Scenario: A source-level rule is added to the checklist

- **WHEN** a rule about hydration, render cost, component primitives or another property of the source is adopted
- **THEN** it SHALL become a checklist row whose id continues from the last one and whose sources cell names where it came from
- **AND** the UI craft source test SHALL fail on a skipped id, a repeated id or a row without a source.

#### Scenario: A new checklist row is added

- **WHEN** a checklist row is added to the UI craft rule index
- **THEN** the QA checklist SHALL name that row id
- **AND** the UI craft source test SHALL fail while the QA checklist does not name it.
