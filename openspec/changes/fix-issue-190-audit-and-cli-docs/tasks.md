# Tasks

## 1. Change record

- [x] 1.1 proposal.md, design.md and the `design-pipeline` spec delta; Closes #190.
- [x] 1.2 `npm exec -- openspec validate fix-issue-190-audit-and-cli-docs --strict` and `npm run specs:check`.

## 2. Audit

- [x] 2.1 `skill/scripts/interaction-audit.cjs`: exempt an inline text link that is the only content of a paragraph; keep links separated by a `<br>` or an in-flow block, links outside prose blocks and links that share their paragraph with other content measured.
- [x] 2.2 `skill/references/ui-craft-sources.md`: state the prose-link boundary.

## 3. CLI documentation

- [x] 3.1 `skill/references/pipeline-reference.md`: one usage line for `plan`, `resume`, `explain-block`, `package`, `patterns`, `ui-ir`, `design-code-map`, `art-motion`, `diligence` and `style-signals`.
- [x] 3.2 `CHANGELOG.md`: record the change.

## 4. Verification

- [x] 4.1 `tests/issue-190.test.cjs`, registered in `scripts/test-manifest.json`.
- [x] 4.2 `node --test tests/issue-190.test.cjs tests/interaction-audit.test.cjs tests/reference-name-scope.test.cjs tests/upstream-path.test.cjs`.
- [ ] 4.3 `npm ci`, root `npm test`, `npm run specs:check`.
