# Tasks

## 1. Change records

- [x] 1.1 proposal.md, design.md and the `design-pipeline` spec delta.
- [x] 1.2 `npm exec -- openspec validate devlog-terminal-style-pack --strict` and `npm run specs:check`.

## 2. Pack and templates

- [x] 2.1 `styles/devlog-terminal/style.json`: palette, font roles through the catalog, grammar, materials, motion, checks with the 64 px guidance and the traps, provenance, examples.
- [x] 2.2 `layouts-devlog.cjs` and five template folders (manifest, default render, spec.md); `bank.cjs` registry.

## 3. Docs and tests

- [x] 3.1 `skill/references/template-bank.md`, `package-resources.json`, `CHANGELOG.md` [Unreleased].
- [x] 3.2 `tests/template-devlog-terminal.test.cjs` (registered in `scripts/test-manifest.json`); counts in `tests/template-bank.test.cjs` and `tests/template-style-pack.test.cjs`.
- [x] 3.3 Focused tests (template bank, style packs, devlog-terminal) and `template check --browser` on every default render.
