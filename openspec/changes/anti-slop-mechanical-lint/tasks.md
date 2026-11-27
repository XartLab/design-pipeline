# Tasks

## 1. Change records

- [x] 1.1 proposal.md, design.md and the `design-pipeline` spec delta.
- [x] 1.2 `npm exec -- openspec validate anti-slop-mechanical-lint --strict` and `npm run specs:check`.

## 2. Behaviour

- [x] 2.1 Vendor sloplint at `4f6a46c` unmodified with LICENSE; `THIRD_PARTY_NOTICES.md`, vendor manifest, `package-resources.json`.
- [x] 2.2 Gate map drafted and reviewed in this change as `anti-slop-lint-map.draft.json` (92 entries: 22 hard, 27 contextual, 39 preference, 4 excluded); moved to `skill/references/anti-slop-lint-map.json` unchanged. The previously omitted `38ii`/`38iii` map to preference/fashion-tell-advisory and base `49` maps to contextual/component-defaults-are-art-directed.
- [x] 2.2a Rubric: add the hard rule `no-fabricated-proof` with its check and fix, following the existing rule shape.
- [x] 2.3 `evaluate-anti-slop.cjs --lint`/`--url`: run, map, `lint` evidence block with target digest, `LINT_CONTRADICTS_PASS`, `LINT_GATE_UNMAPPED`.
- [x] 2.4 Evidence schema: optional `lint` block.

## 3. Tests and docs

- [x] 3.1 Fixture pages for each scenario; registered in `scripts/test-manifest.json`.
- [x] 3.2 `references/anti-slop-review.md`: the lint step, classes and how to answer a contextual finding.
- [x] 3.3 CHANGELOG entry.

## 4. Verification

- [x] 4.1 Run on KATANAview pages and motion-recipe specimens; review hard findings by hand. Initial results: 13 hard findings on KATANAview (1 real reduced-motion, 4 real-but-minor disabled-opacity, 8 false positives), 7 on specimens (1 real contrast, 6 false positives); detailed manual review is in `verification.md`.
- [ ] 4.2 Full `npm test` on the follow-up contribution must finish green. The focused map-completion test passed (7 tests, 0 failed), but the clean full run failed unrelated repository QA; see `verification.md`.