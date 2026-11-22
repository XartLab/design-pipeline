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

## 4. Owner-facing legacy workflow

The owner-facing `next --deliverable ui|web` workflow keeps its own stage list (`concepts`, `components`,
`work` / `build`) and its own state file. It now consumes the same validator and the same receipt
location (`design-system-decision.json` at the project root), so a quick or standard ui/web run is gated
too.

- [x] 4.1 Gate the legacy `concepts`, `components` and `work` / `build` stages on the same validator,
  before the stage's `finished` predicate, so a missing, changed or removed receipt reopens a
  completed stage. `decide --stage concept|components` refuses while it does not hold.
- [x] 4.2 Give the legacy workflow one receipt location, shared with the change phases:
  `next --project-root <project> --design-system-decision <file>` binds it, and the file lives at the
  project root beside `state.json`.
- [x] 4.3 Extend the shared workflow fixtures with a decision receipt and cover the drift cases
  (receipt changed after `concepts`, receipt removed after `work`).
- [x] 4.4 Re-check a bound receipt after the change leaves the governed phases, and invalidate the
  foundations, evidence, control results and visual-task progress recorded under a replaced decision.
