# Tasks

## 1. Change records

- [x] 1.1 proposal.md, design.md and the `web-workflow` spec delta; Relates to #215.
- [x] 1.2 `npm exec -- openspec validate recording-to-site --strict` and `npm run specs:check`.

## 2. Behaviour

- [x] 2.1 `workflows/replicate.cjs`: parse exact recorded-behavior table, report extract findings and current delivery errors for web/ui video references.
- [x] 2.2 `gate-core.cjs`: optional `recordedBehaviours` input preserves old behavior when absent; web/ui delivery decisions check current ids against root `component-state-matrix.json`.

## 3. Tests and docs

- [x] 3.1 Tests for parser, option compatibility, invalid table and extract/delivery enforcement live in existing manifest-owned suites (`tests/workflow-replicate.test.cjs`, `tests/design-control-runtime.test.cjs`).
- [x] 3.2 `references/recording-to-site.md` in our words; registered in `package-resources.json`, `skill/tools/README.md`, and linked from `workflow-web.md`.
- [x] 3.3 CHANGELOG; `THIRD_PARTY_NOTICES.md` concept credit to motion2code at `0f00328`.

## 4. Verification

- [ ] 4.1 One generated interface recording end to end: table, matrix, delivered page with working controls on phone and desktop.
