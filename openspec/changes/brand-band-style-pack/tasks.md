# Tasks

## 1. Change records

- [x] 1.1 proposal.md, design.md and the `design-pipeline` spec delta.
- [x] 1.2 `npm exec -- openspec validate brand-band-style-pack --strict` and `npm run specs:check`.

## 2. Pack, illustrations and templates

- [x] 2.1 `styles/brand-band/style.json`: font roles through the catalog, measured palette and grammar, materials, motion, checks with guidance, provenance, example.
- [x] 2.2 `illustrations-band.cjs`: eight subjects as marker ribbons and flat fills, deterministic, with centre lines.
- [x] 2.3 `layouts-band.cjs` and six template folders (manifest, default render, spec.md); `bank.cjs` registry.

## 3. Kit, docs and tests

- [x] 3.1 `examples/brand-band-site-kit/` (index.html, README.md); `template check --browser` at 1440 and 390.
- [x] 3.2 `skill/references/template-bank.md`, `package-resources.json`, `CHANGELOG.md` [Unreleased].
- [x] 3.3 `tests/template-brand-band.test.cjs` (registered in `scripts/test-manifest.json`); counts in `tests/template-bank.test.cjs` and `tests/template-style-pack.test.cjs`.
- [x] 3.4 Focused checks only: the new test file, template-bank.test.cjs, the two count tests by name, `npm run specs:check`; repository QA (`npm test`) is left to CI.
