## Why

Relates to #19. `designer-pipeline design-system decide` already fails closed and marks a zero-result product query as inconclusive, but the `design-pipeline.design-system-decision.v1` receipt it writes has no consumer. Stage 0 asks for a decision in prose, and nothing stops a change from advancing into directions, design-spec, tasks or implementation on an undecided substrate. A product phrase that misses the catalog ("research console") can therefore be hardened into DESIGN.md, OpenSpec, dependencies and tests as if the owner had chosen it.

## What Changes

- The v1 receipt is extended in place with the change it belongs to (`changeId`), who authorized the substrate choice (`authorization`) and the candidates the decision compared (`compared`). The schema id and the ten original fields stay.
- A shared validator, `validateDesignSystemDecision`, decides whether a receipt is consumable: schema-valid and ready, an owner-authorized claim carries the owner's instruction or the delegating workflow state, and every other choice records the searched capabilities and the compared candidates. A product-phrase miss with capability hits must be marked inconclusive.
- `change advance` refuses to move a change into `directions`, `design-spec`, `motion-spec`, `tasks` or `implementation` without a receipt, binds the receipt's hash into `state.extensions.designSystem`, and re-checks it on every later mutation, including `gate-review`, `verification`, `release-readiness` and `archive`: a changed or removed receipt invalidates the advancement instead of preserving stale approval.
- `change advance --design-system-decision <file>` binds the receipt; the file must live inside the change. A replacement receipt is a new substrate: the foundations, evidence, control results and visual-task progress recorded under the previous one are dropped rather than carried over.
- The owner-facing `next --deliverable ui|web` workflow binds the same receipt at the project root (`next --project-root <project> --design-system-decision <file>`) and gates its `concepts`, `components`, `work` and `build` stages on it, so a missing, edited or removed receipt reopens a stage that already finished. `decide --stage concept|components` refuses the same way. Film and edit runs are not gated.
- An explicit owner scratch choice stays a quick path: it needs no catalog and no catalog search, and it is recorded as a structured decision with the owner's own words or the delegating workflow state.

## Capabilities

- `design-pipeline`: ADDED `design-system decision gates the design phases`.

## Reuse

- `decideDesignSystem` and the existing `design-pipeline.design-system-decision.v1` receipt schema; no parallel receipt or gate.
- `state.foundations`-style path/sha256 lineage and the `extensions` projection of `design-pipeline.state.v2`.
- The `BLOCKED` error code, so a refused advancement exits 2 (gate failed) and keeps the machine reason in the finding code.

## Impact

- `skill/scripts/design-system-decision-core.cjs` (receipt fields, `compared`, the shared validator).
- `skill/scripts/pipeline-state-core.cjs` (the binding, the phase gate, the re-check after the governed phases, the invalidation on a replaced decision, the state projection).
- `skill/scripts/cli-core.cjs` (`--design-system-decision` on `change advance` and `next`, registered in `KNOWN_OPTIONS`).
- `skill/scripts/workflow-core.cjs` (the legacy ui/web stage gate, the receipt binding, the direction/component refusal).
- `skill/references/design-system-decision.schema.json`, `skill/references/stages.md`, `skill/references/pipeline-reference.md`, `scripts/test-manifest.json`, `tests/design-system-decision-gate.test.cjs`, `tests/workflow-next.test.cjs`, `tests/pipeline-state.test.cjs`, `tests/helpers/decision-receipt.cjs`.
