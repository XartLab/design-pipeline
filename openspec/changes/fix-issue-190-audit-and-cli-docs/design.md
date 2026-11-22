# Design

## Context

The interaction audit builds one `controls` list and uses it for `audit.target-size`, `audit.control-gap` and `audit.control-inset`. An inline text link is currently removed from that list only when `sentenceText` finds other painted, visible text on the link's own line run. A link that is the entire paragraph therefore stayed in the list and was measured as a 20px-high control.

`audit.target-size` and `audit.control-gap` currently share the exemption, and the main spec states that a link separated from surrounding text by a `<br>` or an in-flow block box is not exempt. This change extends the target-size exemption only; the other checks keep the control list they use today.

## Decisions

### Prose-only inline link exemption, for target size only

`audit.target-size` skips a control when all of the following hold:

1. It is an `a[href]` or `[role="link"]` with computed `display: inline`.
2. It is the only element in its nearest `<p>` ancestor.
3. That paragraph holds no `<br>`.
4. The paragraph's text is exactly the link's own text.

Rule 2 is what fixes the two motion-recipe specimens, whose recipe link is the only content of its paragraph. It keeps the existing negatives:

- A link after a paragraph (`<div><p>…</p><a>Next</a></div>`) is not inside a `<p>`, so it stays measured.
- A link after a `<br>` inside a paragraph shares no line run with text, and the paragraph has other content, so it stays measured.
- A link beside hidden, invisible, transparent or clipped text keeps the current sentence rule, so it stays measured.
- A link that shares its paragraph with other text stays measured unless the sentence rule exempts it.

`audit.control-gap` and `audit.control-inset` keep using the existing `controls` list, so the new exemption does not change what they measure.

### Command documentation

`skill/references/pipeline-reference.md` gains a "Public CLI Commands" table with one usage line per undocumented top-level command. The usage strings are taken from `designer-pipeline describe <command>`, so the docs and the CLI stay in step.

## Files

- `skill/scripts/interaction-audit.cjs`: the target-size exemption predicate.
- `openspec/changes/fix-issue-190-audit-and-cli-docs/specs/design-pipeline/spec.md`: the requirement delta that states the boundary.
- `skill/references/ui-craft-sources.md`: the `audit.target-size` row.
- `skill/references/pipeline-reference.md`: the command table.
- `tests/issue-190.test.cjs`: regression coverage for the exemption boundary, the two specimens and the command table.
- `scripts/test-manifest.json`: registers the new test file.
- `CHANGELOG.md`: records the change.

## Compatibility and migration

No public command, receipt, schema or packaging contract changes. The audit contract changes only for `audit.target-size` on inline text links that are the sole content of a paragraph, which is the case the issue reports as a false positive. The two Windows-only failures named in the issue (`reference-name-scope`, `upstream-path`) already pass on the current `main` after the portability fix in #225; no production change is needed for them.

## Out of scope

`audit.text-contrast` advice for non-measurable backgrounds, and the unrelated failures seen in the full Windows `npm test` run (tar `--force-local`, browser launch timeouts, a missing packaged UI-craft reference) are not changed by this work.
