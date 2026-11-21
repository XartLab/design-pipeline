# Tasks

## 1. The receipt and its validator

- [x] 1.1 Extend the v1 receipt with `changeId`, `authorization` and `compared` in `design-system-decision-core.cjs` and in `skill/references/design-system-decision.schema.json`.
- [x] 1.2 Record the compared candidates while `decideDesignSystem` evaluates the catalog, and skip the catalog comparison for an explicit owner scratch choice.
- [x] 1.3 Add `validateDesignSystemDecision`: the receipt shape, the authorization, the searched capabilities, the compared candidates and the inconclusive marker.

## 2. The phase gate

- [x] 2.1 Bind the receipt into `state.extensions.designSystem` with its path and hash, and validate that projection in `validateV2`.
- [x] 2.2 Refuse the advancement into `directions`, `design-spec`, `motion-spec`, `tasks` and `implementation` without a consumable receipt, and re-check the bound receipt on every later mutation.
- [x] 2.3 Register `--design-system-decision` in `KNOWN_OPTIONS` and bind the receipt from the `change advance` command; the file must live inside the change.

## 3. Tests and documents

- [x] 3.1 Cover the consumable-decision contract and the phase gate in `tests/design-system-decision-gate.test.cjs` and register it in `scripts/test-manifest.json`.
- [x] 3.2 State the gate in `skill/references/stages.md` and `skill/references/pipeline-reference.md`.
