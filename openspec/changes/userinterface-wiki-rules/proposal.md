# Proposal: hold the userinterface-wiki UI rules in the project and measure duplicate View Transition names

## Why

`raphaelsalaja/userinterface-wiki` (MIT, revision `256a954`) is a list of 152 UI rules across 12
categories. The pipeline held none of them as text: the View Transitions rules appeared only as an
optional companion route, the presence, container-animation, Laws of UX, icon-morph and
predictive-prefetching rules were missing, and the coverage map knew nothing about the source. The
rules also carried values this project has already decided against (ease-in exits, a 32px target
minimum, a fixed 50ms stagger cap), so importing them wholesale would have replaced local
decisions.

One of the rules is measurable on a rendered page: two visible elements must not share a
`view-transition-name`. Nothing checked that, so a duplicate name silently broke a transition.

## What changes

- `sources.lock.json` gains `userinterface-wiki` as an `adapted-reference` at revision `256a954`,
  with the record document `skill/references/userinterface-wiki-rules.md`. No upstream rule file or
  command ships.
- `skill/references/userinterface-wiki-rules.md` restates the non-audio rules in this project's
  terms: animation principles and timing, exit and presence behavior, pseudo-elements and View
  Transitions, container-size motion, Laws of UX, predictive prefetching, morphing icons, and
  typography and visual treatment.
- `skill/references/ui-craft-sources.md` gains review rows `UC-45` to `UC-57`, the source key
  `UIW`, and the measured audit row for the new code.
- `skill/references/interface-defaults.md` gains the pseudo-element, View Transition and typographic
  feature rules, and expands its container-animation and presence rules.
- `skill/references/qa-checklist.md` names each new checklist row so the review records it.
- `skill/scripts/interaction-audit.cjs` gains the required code `audit.view-transition-names`: two
  visible elements sharing a computed `view-transition-name` fail, a unique name passes, and a page
  that names no element reports `not-applicable`.
- `skill/references/ui-rule-coverage.json` gains one row per upstream rule file (152 rows), with the
  audio and sound-synthesis rules `pending` on #360 and the three deliberate differences
  `not-adopted` with their governing local rule.
- `scripts/refresh-ui-rule-fixture.cjs` learns one extraction mode for a rule directory: the rule
  id is the file basename, the quoted text is the upstream index line, and the file list, the index
  and the map must agree one to one.

## What is reused

- The lock, `sources:update` and `sources:check` are unchanged; the record document carries the
  pinned revision and the hash of the upstream rule files.
- The measured audit, the review checklist and the Component Conformance record are unchanged. No
  gate, receipt field, schema id, CLI command or flag is added.
- `ui-rule-coverage.json` keeps its shape: one row per upstream rule, each naming an `audit.*`
  code, a `UC-` id, project text, `pending` or `not-adopted`.

## Not in scope

- The upstream audio feedback and sound synthesis categories (#360).
- Bundling the upstream skill or running any of its scripts.
- Measuring the presence, container, prefetch or morphing rules on a rendered page.
