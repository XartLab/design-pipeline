# Tasks

## 1. Change records

- [x] 1.1 proposal.md, design.md and the `design-pipeline` spec delta.
- [x] 1.2 `npm exec -- openspec validate institute-essay-style-pack --strict` and `npm run specs:check`.

## 2. Pack and templates

- [x] 2.1 `styles/institute-essay/style.json`: font roles through the catalog, measured palette and grammar, materials, motion, checks with the faint-grey guidance, provenance, examples.
- [x] 2.2 `layouts-essay.cjs` and five template folders (manifest, default render, spec.md); `bank.cjs` registry.

## 3. Kit, docs and tests

- [x] 3.1 `examples/institute-essay-report-kit/` (index.html, README.md); `template check --browser` on it.
- [x] 3.2 `skill/references/template-bank.md`, `package-resources.json`, `CHANGELOG.md` [Unreleased].
- [x] 3.3 `tests/template-institute-essay.test.cjs` (registered in `scripts/test-manifest.json`); counts in `tests/template-bank.test.cjs` and `tests/template-style-pack.test.cjs`.
- [x] 3.4 Focused checks only: the new test file, the count tests by name, `npm run specs:check`; repository QA (`npm test`) is left to CI.
