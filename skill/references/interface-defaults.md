# Interface defaults

Scope: small, mostly CSS and markup defaults that every screen should get right without anyone asking, limited to the ones that [good-css.md](good-css.md) and [ui-craft-sources.md](ui-craft-sources.md) do not already state. Project tokens always win: use the token where one exists, and treat the literal values here as fallbacks. Each rule names the symptom to look for in review.

Source: Distilled from raphaelsalaja/skill `defaults` at 5e98985 (MIT); wording and selection are this repository's.

## Already covered elsewhere (do not restate)

Follow these from the existing docs: scroll-edge fades and overflow-only fades, overscroll containment in panels, scroll padding under sticky headers (Good CSS scroll and viewport), hit-area expansion and the 24px target floor, `:focus-visible` outlines, content images with an inner edge, `overflow: clip`, safe areas and `dvh`, tabular numbers, `text-wrap`, concentric radii, reduced motion. The rules below fill the gaps.

## Surfaces

- **Ring first, border second, on floating surfaces.** Popovers, menus and raised cards put a 1px translucent ring as the first layer of `box-shadow` and keep `border: 1px solid transparent`. An opaque border beside a shadow looks doubled, and the transparent border is what forced-colors mode still paints.
  ```css
  .popover {
    border: 1px solid transparent;
    box-shadow: 0 0 0 1px var(--ring), 0 1px 2px rgb(0 0 0 / .06), 0 4px 8px rgb(0 0 0 / .04), 0 12px 24px rgb(0 0 0 / .03);
  }
  ```
- **Layer shadows, all falling down.** Use the elevation token. Without one, stack two or three layers where blur grows and opacity drops, with only downward offsets. One heavy `0 4px 16px rgb(0 0 0 / .2)` reads as a smudge. Every surface on a screen shares the light direction.
- **Give scroller content room for its shadows.** An `overflow: auto` ancestor clips child shadows at its padding edge. Add padding that exceeds blur plus offset and cancel it with an equal negative margin so alignment with neighbours holds.
  ```css
  .scroller { overflow: auto; padding: 8px; margin: -8px; }
  ```
- **Sticky chrome keeps a 1px edge.** A sticky header or footer gets a hairline against what scrolls under it, using the border token. Without it, text appears to slide into the bar. A shadow that only shows once content is scrolled under is acceptable instead.
- **Avoid nesting cards** unless the inner surface is a different kind of object (a code block, an embedded media frame). Otherwise a card inside a card doubles borders, padding and radii. Put the heading outside and let one surface hold the content, or separate groups with space and a divider.
- **Color scheme reaches the browser.** A dark theme sets `color-scheme: dark` on the root so scrollbars, form controls and the canvas follow it. Add one `theme-color` meta per scheme, matched to the top of the page rather than the brand color.
- **Switch themes quietly.** Turn transitions off for one frame while the theme attribute changes, otherwise every color fades at once. If the project's theme library has an option for this, use that instead.
  ```ts
  const s = document.createElement("style");
  s.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.append(s);
  document.documentElement.dataset.theme = next;
  getComputedStyle(document.body).opacity; // force style flush
  requestAnimationFrame(() => s.remove());
  ```

## Code, tables and truncation

- **Code and wide tables scroll sideways, never wrap.** Use `overflow-x: auto; white-space: nowrap`. Hide the scrollbar only if an edge fade still signals more content. A wrapped code line changes meaning.
- **Truncated text has a way back.** Anything cut off and needed by the user opens in full through a tooltip, an expand control or a detail view. File names and paths truncate in the middle where they differ. Numbers, amounts and dates are never truncated; make room instead.
- **Drop missing optional fields.** An empty role or website omits its line. A lone dash or "N/A" where data is absent suggests a bug.
- **Format through `Intl`.** Numbers, dates, lists and plurals use `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.ListFormat` and `Intl.PluralRules`. Symptoms: "1 members", raw `1284`, hard-coded month names.

## Touch and mobile

See [mobile-web.md](mobile-web.md): tap feedback, `touch-action`, zoom, 16px inputs and hover gating live there. One addition: buttons, tabs, chips and drag handles set `user-select: none` so a long press does not highlight the label; prose and links inside prose stay selectable.

## Forms and feedback

- **Enter submits.** One-field forms and the last field of a form submit on Enter. In a textarea Enter adds a line and Cmd or Ctrl plus Enter submits. A search box with no wrapping `form` is the usual miss.
- **Accept messy input.** Take pasted spaces, brackets, dashes and trailing whitespace. Normalize in code and display the clean value. Never block paste.
- **Labels share the hit area.** Wrap control and text in one `label`, or link them with `for`, so clicking the text works the control.
- **Keep submit enabled.** The submit button stays enabled until the request starts; a button disabled until the form is valid gives no reason why. Error placement and focus follow UC-12 in [ui-craft-sources.md](ui-craft-sources.md).
- **Busy buttons keep their label.** While the request runs, keep the label, add an indicator, disable the button and keep its width. Swapping the label for a bare spinner shrinks the button.
- **Announce updates.** Toasts, result counts and inline validation live in a polite region (`role="status"`) that exists empty before its text changes. A region mounted with its text is often not announced.
- **Keys ignore typing.** Single-key shortcuts must skip `input`, `textarea`, `select` and `[contenteditable]` targets.
- **One dialog at a time.** Do not open a dialog from a dialog. Use a menu, a popover or a new view.

## Navigation and state

- **Links are links.** Navigation is `<a href>`, so new-tab, middle click and copy link work. A `div` with a click handler that changes the route fails all three.
- **Shareable state lives in the URL.** Filters, tabs, pagination, sort and open panels write to the query string so refresh, share and Back keep them.
- **Cached views render at once.** Coming back to a loaded view shows content immediately, with no fade or skeleton flash.

## Waiting

- **Respond within about 400ms or show feedback now.** Use an optimistic value, a skeleton or a progress bar. A loading branch that renders nothing is a finding.
- **Delay then hold.** Show a spinner or skeleton only after 150 to 300ms, then keep it at least 300 to 500ms once shown, so a fast response shows nothing and a medium one does not flicker. The skeleton matches the layout it replaces.
  ```ts
  // visible = loading for longer than `delay`, kept up until `minimum` has passed
  const delay = 200, minimum = 400;
  ```

## Pseudo-elements and native styling

- **Prefer a pseudo-element over an extra node.** `::before` and `::after` carry decoration that does not need its own element; `::marker` styles a list bullet, `::first-line` a lead line, `::backdrop` a dialog backdrop, `::placeholder` an input placeholder and `::selection` a selected run. Use them where the design is a decoration or a native state, not where the content is real text a screen reader must read.
- **A pseudo-element needs `content` and a positioned parent.** `content` is required for `::before` and `::after`; an absolute pseudo-element needs a positioned containing block, otherwise it anchors to the wrong ancestor.
- **Give pseudo-elements a layer.** A pseudo-element that paints over content takes an explicit z-index from the project's stacking scale, so it does not land above a control it belongs to.

## View Transitions

- **Use the browser's View Transitions for a navigation-level change.** The element that moves carries a `view-transition-name`; the name is set when the transition starts and cleared when it ends, and `::view-transition-*` pseudo-elements carry any custom styling.
- **One name, one element.** Two visible elements may not share a name; `audit.view-transition-names` measures that on the rendered page. `none` does not take part, Chromium's implicit `root` name on `<html>` is not authored, and `match-element` is unique per element.
- **Do not use it where the change must be interruptible or cancellable**, and do not swap an interaction-heavy animation system for it. A size change inside a transition is still layout work; a measured FLIP transform plays it as a transform instead.

## Typographic features

- **Oldstyle numerals in prose, lining or tabular figures in data.** A body paragraph with figures reads better with oldstyle numerals; a table, a price column or a dashboard reads better with lining figures, and comparable numbers need tabular figures.
- **Keep contextual alternates on.** `calt` lets a font substitute the right glyph pair automatically; a font that has no alternates is unaffected.
- **Use diagonal fractions for real fractions.** `diagonal-fractions` turns a fraction into a slanted form; without it the font's own fraction glyphs are used.

## Motion details not in the motion rules

- **Name animated properties.** `transition: opacity 150ms, transform 150ms`, never `transition: all`.
- **Toggled state uses transitions, not keyframes**, so a reversal mid-flight retargets (UC-04). Keyframes are for one-shot sequences.
- **Animate only the axis that changes.** Do not animate width when only height changes.
- **Measure an inner element to animate container size.** Observe a child with `ResizeObserver` and animate the outer box. Measuring and animating the same node loops. While a panel collapses, give its content a fixed open width so text does not reflow mid-motion.
- **Guard the first measurement.** A container measured on its first render reports zero; fall back to `auto` or an intrinsic size until a real size arrives, so the panel never animates from zero.
- **Clip only while the size changes.** `overflow: hidden` belongs to the transition, not to the resting state; restore the intended overflow when it ends.
- **Measure through a callback ref.** A ref that follows the node keeps the measurement attached when the content is replaced.
- **Reach for size animation last.** Animate the container size for buttons, accordions and compact interactive panels; ordinary page layout uses its own flow.
- **Tooltips warm up once.** The first tooltip in a group waits; while one is showing, neighbours open instantly without animation; all close instantly.
- **Swapped icons cross-fade.** Copy to copied: scale from about 0.25 to 1, opacity 0 to 1, blur 4px to 0, no bounce. Add a 2px blur to a cross-fade only when it still reads as two overlapping objects, and keep blur under 20px.
- **Morph an icon only when it is the same object.** Two states of one icon (a copy action changing to a check) may morph when the project draws linear icons; two unrelated shapes cross-fade. A morphing set shares one viewBox and the same three-line structure, an unused line collapses to one constant, rotational variants reuse one group, stroke line caps are round, rotation uses the project spring primitive and reduced motion falls back to the end state. The icon carries `aria-hidden="true"`; the control keeps its own name.
- **Flicks dismiss, edges resist.** A sheet dismisses on distance or on speed (a short, fast flick counts, roughly above 0.1 px/ms). Drag past a boundary meets growing friction, not a wall. Every gesture also has a button or key path.
- **Exits need a presence boundary.** In React with a presence library, an element with an exit animation sits inside the presence wrapper and is keyed by a stable id, not an index.
- **Presence hooks belong in the child.** The component that knows whether it is exiting calls `useIsPresent`; the parent that owns the boundary does not. A child that cleans up asynchronously calls `safeToRemove` only when that cleanup is done, and it takes no pointer or keyboard input while it exits.
- **Budget the presence mode.** `mode="wait"` runs the exit before the entrance, so each phase needs its own share of the duration budget; `mode="sync"` overlaps them and needs a layout check; `popLayout` keeps reordered lists from jumping. A nested presence boundary propagates the exit, and its timing follows the parent.

## Review severity hint

High: clipped shadow, hotkeys firing while typing, stacked dialogs, field rejecting pasted input, silent wait. Medium: replayed entrances, `transition: all`. Low: opaque border beside a shadow, borderless sticky header, light scrollbar on a dark page.
