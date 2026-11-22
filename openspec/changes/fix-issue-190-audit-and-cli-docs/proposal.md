# Fix issue #190 audit and CLI docs

## Why

GitHub issue #190 reports three concrete gaps:

- `audit.target-size` flags the prose links on the `hp-ghost-bar` and `cooldown-completion` motion-recipe specimens even though they are inline text links in prose. The engine only exempted a link that had other painted sentence text beside it, so a link that was the whole paragraph was measured as a standalone control.
- Ten top-level CLI commands (`plan`, `resume`, `explain-block`, `package`, `patterns`, `ui-ir`, `design-code-map`, `art-motion`, `diligence`, `style-signals`) run but had no task guide anywhere under `skill/` or `docs/`.
- `reference-name-scope` and `upstream-path` failed on a Windows workstation. Both pass on current `main` after the Windows-portability fix in #225, so this change records the verified state instead of changing them.

## What Changes

- The interaction audit exempts an inline text link that is the only content of its paragraph from `audit.target-size`. A link that shares its paragraph with other content is still measured, and a link separated from surrounding text by a `<br>` or an in-flow block box is still measured. `audit.control-gap` and `audit.control-inset` keep their current list of controls.
- `skill/references/pipeline-reference.md` gains a "Public CLI Commands" table with one usage line for each of the ten undocumented top-level commands.
- `tests/issue-190.test.cjs` locks the prose-link boundary, renders both reported specimens, and checks the command table, and is registered in `scripts/test-manifest.json`.

## Reuse

The existing interaction audit, its `CONTROL` selector, the existing `sentenceText` line-run walk, the existing OpenSpec `design-pipeline` requirement, and the existing `designer-pipeline describe` output are reused. No new gate, receipt schema, resolver or policy digest is added.

## Impact

Affects `design-pipeline` (interaction audit contract, CLI documentation). No public command, receipt or packaging contract changes.
