## ADDED Requirements

### Requirement: design phases need a consumable design-system decision

A change SHALL NOT advance into `directions`, `design-spec`, `motion-spec`, `tasks` or `implementation` without a schema-valid `design-pipeline.design-system-decision.v1` receipt that names the change it governs. The receipt SHALL be bound to the change state with its hash, and every later mutation of that change SHALL re-check it.

#### Scenario: no receipt before the directions

- **WHEN** a change advances into `directions` without a design-system decision receipt
- **THEN** the advancement SHALL be refused as a blocked gate
- **AND** the reason SHALL name the missing receipt

#### Scenario: a receipt from another change

- **WHEN** the bound receipt names a different change than the one advancing
- **THEN** the advancement SHALL be refused as a blocked gate

#### Scenario: a receipt outside the change

- **WHEN** the bound receipt resolves outside the change root
- **THEN** the advancement SHALL be refused as a blocked gate

### Requirement: the decision records what was searched and compared

A consumable receipt SHALL record the searched capabilities and the compared candidates, unless the owner explicitly chose a from-scratch substrate. A product-level query that returns nothing while capability queries return candidates SHALL be marked inconclusive.

#### Scenario: an implicit fallback without searched capabilities

- **WHEN** a receipt selects a substrate but records no searched capability
- **THEN** it SHALL NOT be consumable

#### Scenario: a fallback without compared candidates

- **WHEN** an agent-made `custom`, `adopt` or `substitute` receipt records no compared candidate
- **THEN** it SHALL NOT be consumable

#### Scenario: a zero-result product query

- **WHEN** the direct product query returns zero results and the capability search found candidates
- **THEN** the receipt SHALL be marked inconclusive to be consumable

### Requirement: an owner scratch choice stays a quick path

An explicit owner choice to build from scratch SHALL be consumable without a catalog, a catalog search or another interview, and SHALL be recorded as a structured decision that carries the owner's own words or the delegating workflow state.

#### Scenario: the owner chose from scratch

- **WHEN** a `custom` receipt records an owner scratch choice with the owner's quoted instruction
- **THEN** it SHALL be consumable without a capability inventory
- **AND** no catalog search SHALL be required to produce it

#### Scenario: an agent claims the owner chose

- **WHEN** a receipt claims an owner authorization without the owner's instruction or the delegating workflow state
- **THEN** it SHALL NOT be consumable

### Requirement: a changed decision invalidates the advancement

The change state SHALL keep the bound receipt's hash. A receipt that changed or disappeared SHALL invalidate the advancement and the evidence that depends on it.

#### Scenario: the receipt changed after it was bound

- **WHEN** the bound receipt's bytes changed
- **THEN** the next mutation of that change SHALL be refused as a blocked gate

#### Scenario: the receipt was removed

- **WHEN** the bound receipt no longer exists
- **THEN** the next mutation of that change SHALL be refused as a blocked gate

### Requirement: a reference decision is not an adopted substrate

A `reference` decision SHALL NOT name a runtime substrate, SHALL NOT grant Visual Acceptance, and SHALL report the relevant catalog capabilities the decision did not take.

#### Scenario: a reference decision is consumed

- **WHEN** a `reference` receipt is consumed
- **THEN** the result SHALL report no runtime substrate
- **AND** it SHALL report the unused relevant catalog capabilities
