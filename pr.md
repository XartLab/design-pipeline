Refs #19

XAR-127: the design-system decision receipt now gates the design phases.

- The v1 receipt carries the change it governs (`changeId`), who authorized the substrate choice (`authorization`) and the candidates the decision compared (`compared`, computed by `decideDesignSystem`).
- `change advance` refuses `directions`, `design-spec`, `motion-spec`, `tasks` and `implementation` without a schema-valid receipt, binds the receipt's hash into the change state and re-checks it on every later mutation, so an edited or removed receipt invalidates the advancement.
- An explicit owner scratch choice stays a quick path: no catalog, no catalog search, no extra interview, but a structured decision that carries the owner's own words.
- A `reference` decision names no runtime substrate and grants no Visual Acceptance; the gate reports the relevant catalog capabilities the decision did not take.

Still open on this branch (section 4 of the OpenSpec change): the owner-facing `next --deliverable ui|web` workflow keeps its own stage list and is not gated yet.

OpenSpec change: `openspec/changes/design-system-decision-gate`
