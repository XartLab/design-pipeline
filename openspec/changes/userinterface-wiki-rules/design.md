# Design

## Files and ownership

| File | Role | Maintained by |
| --- | --- | --- |
| `sources.lock.json` | Revision of the upstream rule list | `npm run sources:update` |
| `skill/references/userinterface-wiki-rules.md` | Record document; frontmatter carries `reviewedRevision` and `reviewedContentHash` over the upstream rule files | `sources:update` rewrites revision, hash and date; prose by hand |
| `skill/references/ui-rule-coverage.json` | The map, one row per upstream rule file | By hand |
| `tests/fixtures/ui-rule-coverage/upstream-rules.json` | Pinned rule files with their hashes and the upstream index lines they were read at | `scripts/refresh-ui-rule-fixture.cjs` only |
| `skill/references/ui-craft-sources.md` | Audit table and `UC-` checklist the map points to | By hand |
| `skill/references/interface-defaults.md` | Project-owned defaults the adapted guide points to | By hand |
| `skill/scripts/interaction-audit.cjs` | The measured duplicate-name check | By hand |

## The rule directory is a source shape of its own

The upstream ships one Markdown file per rule, plus two metadata files (`_sections.md` and
`_template.md`). A rule is therefore identified by its file basename, and the upstream index in
`skills/SKILL.md` is the second, independent record of the same set.

`scripts/refresh-ui-rule-fixture.cjs` reads both and requires them to agree:

- the rule files are every `.md` under the rule directory except the two metadata files;
- every rule file has exactly one index line, and every index line has exactly one rule file;
- a repeated file, a file without an index row and an index row without a file all fail the refresh.

The pinned fixture keeps one entry per rule file with its path and hash, and the map keeps one row
per rule id. `tests/ui-rule-coverage.test.cjs` compares the two sets, so a rule file that upstream
adds, renames or removes cannot pass unnoticed, and the count is pinned at 152.

The extracted rule text is the upstream index line, which names the rule and states it in one
sentence. It is quoted under the upstream MIT license and recorded in
`THIRD_PARTY_NOTICES.md`.

## The hash covers the whole rule directory

`adapted-reference` records hash the `sourceFiles` their frontmatter names. A directory entry with a
trailing slash lists every tracked file under it, sorted by path, so a new rule file changes the
hash without a hand-maintained file list. The record document names `skills/SKILL.md` and
`skills/rules/`.

## Measuring duplicate View Transition names

`audit.view-transition-names` is a required check: it always runs and needs no declaration.

Participation: every visible element under the audit's existing visibility model, read from computed
style so a stylesheet rule counts as well as an inline attribute. `none` does not take part in a
transition and `match-element` is unique per element by definition, so neither is a collision.

Result: one finding per duplicated name, naming the affected selectors. A name used by one visible
element passes. A page that names no element reports `not-applicable`, because there is nothing to
measure.

## Not adopted, and why

| Upstream rule | Local decision |
| --- | --- |
| `easing-exit-ease-in` | The project exit token wins; without one, ease-out, never ease-in (`ui-craft-sources.md#precedence`). |
| `exit-matches-initial` | The local exit is a softer treatment with a small offset, not a literal reverse of the entrance (`ui-craft-sources.md#precedence`). |
| `duration-press-hover` (120–180ms) | Press feedback uses the existing 100–160ms project budget (`animation-opportunity-and-review.md`). |
| `ux-fitts-target-size` (min 32px) | The measured floor is 24x24px; 40px desktop and 44px touch are advice a dense product may waive (`ui-craft-sources.md#precedence`). |
| `physics-no-excessive-stagger` (under 50ms per item) | The project stagger token rules; without one the whole cascade stays inside the duration budget (`ui-craft-sources.md#precedence`). |

The 27 audio feedback and sound synthesis rules stay `pending` on #360; they are listed in the map
so the inventory is complete, but this change holds no audio text.

## Not changed

Lock schema and kinds, `sources:update` apart from the directory hash, importers, the measured
audit apart from the one new code, receipts, gates, CLI commands and flags.
