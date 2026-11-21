# Tasks

## 1. Change records

- [x] 1.1 proposal.md, design.md and the `design-pipeline` spec delta.
- [x] 1.2 `npm exec -- openspec validate template-check-fast-shots --strict` and `npm run specs:check`.

## 2. Behaviour

- [x] 2.1 `page-check.cjs`: `captureBeyondViewport: false`, `FAST_FRAMES` launch flags, passes instead of per-unit states, `setState` writes only changes, batches and clusters of regions.
- [x] 2.2 `tests/helpers/kit-browser-check.cjs`: launch with `FAST_FRAMES`.

## 3. Evidence and docs

- [x] 3.1 Before/after reports of the five kits (1440 and 390 wide) compared as JSON.
- [x] 3.2 The five pack test files, one at a time, under 45-60 s each; `CHANGELOG.md` [Unreleased] entry.
