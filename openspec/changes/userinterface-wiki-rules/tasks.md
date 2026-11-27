# Tasks

## 1. Change records

- [x] 1.1 proposal.md, design.md and the `design-pipeline` spec delta; Closes #359.
- [ ] 1.2 `npm exec -- openspec validate userinterface-wiki-rules --strict` and `npm run specs:check`.

## 2. Sources

- [x] 2.1 `sources.lock.json`: `userinterface-wiki` as `adapted-reference` at revision `256a954`.
- [x] 2.2 Record document `skill/references/userinterface-wiki-rules.md` with `sourceMeta` frontmatter; content hash computed by `adaptedHash` over `skills/SKILL.md` and `skills/rules/`.
- [x] 2.3 `THIRD_PARTY_NOTICES.md`: the MIT notice for the upstream rule list.

## 3. Map and rules

- [x] 3.1 `scripts/refresh-ui-rule-fixture.cjs`: the `rule-files` extraction mode and the directory hash scope in `sources-update.cjs`.
- [x] 3.2 `skill/references/ui-rule-coverage.json`: 152 rows, one per upstream rule file.
- [x] 3.3 `skill/references/ui-craft-sources.md`: rows `UC-45` to `UC-57`, source key `UIW`, the audit row and the Rule coverage section.
- [x] 3.4 `skill/references/interface-defaults.md`: pseudo-element, View Transition and typographic feature rules; the container-animation and presence rules.
- [x] 3.5 `skill/references/qa-checklist.md`: the new checklist rows named.
- [x] 3.6 `package-resources.json`: the record document in `required`.

## 4. Measured audit

- [x] 4.1 `skill/scripts/interaction-audit.cjs`: the required code `audit.view-transition-names`.
- [x] 4.2 `tests/fixtures/ui-audit/violating.html`: two visible elements sharing a name.
- [x] 4.3 `tests/interaction-audit.test.cjs`: the failed, passed and not-applicable outcomes.

## 5. Tests and repository QA

- [x] 5.1 `tests/ui-rule-coverage.test.cjs`: the rule-directory inventory, the 152 rows and the new source shape.
- [x] 5.2 `tests/ui-craft-sources.test.cjs`: gap-free ids, every row cites its source, every new row named in the QA checklist.
- [ ] 5.3 `npm run specs:check`, `npm test`, CHANGELOG.
