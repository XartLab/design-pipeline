# Tasks

- [x] 1.1 proposal.md, design.md and the `design-pipeline` spec delta; Closes #187.
- [x] 2.1 `skill/scripts/cli-core.cjs` containment-error repair text and `reference analyze-video --help`.
- [x] 3.1 `tests/designer-pipeline-cli.test.cjs` covers the recovery text and both help constraints.
- [x] 3.2 `npm run specs:check` (119 passed), `npm run test:browser`, `npm run package:skill -- --output-root dist`, `npm ci` all pass; `node scripts/qa.cjs` was run and exits 1 only on environment failures unrelated to this change (Windows `tar` rejects `--force-local`, browser profile/EPERM contention, template render assertions), while this change's own assertions pass.
