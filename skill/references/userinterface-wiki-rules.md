---
sourceMeta:
  id: userinterface-wiki
  kind: github
  url: https://github.com/raphaelsalaja/userinterface-wiki/tree/256a954080c8bcf1b1ceb1e2a4079d1f24cf593a
  reviewedRevision: 256a954080c8bcf1b1ceb1e2a4079d1f24cf593a
  reviewedContentHash: 735c7f1696d407ed51bec9ffce0cc2d5f27ef01e3b8e9f6ad855c8dc1c8717b3
  contentHashScope: ordered UTF-8 sourceFiles with path-and-newline separators
  sourceFiles: skills/SKILL.md, skills/rules/
  reviewedAt: 2026-11-27T00:00:00.000Z
  freshnessDays: 365
  license: MIT
  useBoundary: reference-only; rules are restated in this project's terms, no upstream skill files or commands are shipped or run
---

# User Interface Wiki rules (adapted)

This guide adapts the non-audio UI rules in raphaelsalaja/userinterface-wiki. It is reference material, not a command set or a new gate; existing project tokens, accessibility and motion contracts take precedence. Use the documented behavior only where the project uses the relevant API or browser capability.

- Source: [raphaelsalaja/userinterface-wiki](https://github.com/raphaelsalaja/userinterface-wiki/tree/256a954080c8bcf1b1ceb1e2a4079d1f24cf593a), MIT, Copyright (c) 2026 Raphael Salaja.
- The upstream audio feedback and sound synthesis categories are tracked as pending in #360 and are not part of this guide.

## Animation principles and timing

Use motion only when it clarifies change; keep repeated, keyboard and high-frequency actions immediate. Keep similar elements on shared tokens, user actions under the project duration budget, and reduce duration before changing the curve. Use ease-out for entrances, ease-in-out for movement and linear only for progress; exits use the local exit token, never ease-in. Spring motion fits gestures, interruptible movement and overshoot; preserve release velocity and choose damping/stiffness that settles without repeated wobble. Keep deformation within the existing subtle scale range and stagger within the project token. Give one element visual priority at a time, dim behind an active modal, and respect the overlay z-index scale.

## Exit and presence behavior

When React uses a presence library, put the conditional exiting child inside its presence boundary and give list items stable unique keys. Use the entrance as a guide to the exit, but keep the exit lighter and use the project exit token; do not force a literal reverse pose or ease-in. Call presence hooks inside the child that consumes them. Disable pointer and keyboard actions while that child exits; invoke `safeToRemove` only after asynchronous teardown finishes. `mode="wait"` serializes entry and exit, so budget each phase accordingly; `mode="sync"` needs a layout-conflict check, and `popLayout` suits reordered lists. Nested presence boundaries propagate exit, with child timing coordinated to the parent. Do not use these APIs when the project has no matching library.

## Pseudo-elements, native styling, and View Transitions

Prefer `::before`, `::after`, `::marker`, `::first-line`, `::backdrop`, `::placeholder` and `::selection` for decoration or native-state styling where they express the design without an extra DOM node. Pseudo-elements need intentional `content`, a positioned containing block where offsets are used, and an explicit layer in the local stacking order; expand a hit target with a pseudo-element only when the control remains semantically operable.

Use the browser View Transitions API for navigation-level changes only when the browser and framework route support it and the change need not be interrupted or cancelled. Keep names unique among visible elements for the transition, set/clear names at the transition boundary, and use `::view-transition-*` pseudo-elements for custom transition styling. Prefer this API to a JavaScript animation library for that page-transition case; do not replace an interaction-heavy animation system or mix APIs inside a component. A named-size change is still layout work; use a measured FLIP transform when that is the intended effect.

## Container-size motion

Use a two-node structure: observe the content node and animate its outer container. `ResizeObserver` avoids repeated synchronous layout reads; callback refs handle changing nodes. Guard the initial zero measurement with an automatic/intrinsic size until a real size arrives. Apply `overflow: hidden` only during the size transition and restore the intended overflow afterward. Use a small follow-up delay only when it helps content catch up, and reserve size animation for controls or compact interactive panels rather than ordinary page layout.

## Laws of UX in interface review

Use these principles as design questions, not numeric laws that override the product:

- Reduce simultaneous choices and reveal advanced options progressively (Hick); group information into scannable chunks rather than prescribing a universal chunk size (Miller).
- Give direct manipulation usable targets and hit areas (Fitts), respecting the project's 24px measured floor; use familiar patterns (Jakob), consistent treatments for similar things, clear group boundaries and proximity.
- Show feedback promptly, with the project's waiting behavior for slower work (Doherty); expose progress in multi-step flows, preserve a clear success ending (peak-end), and make unfinished work visible when a user must return (Zeigarnik).
- Move avoidable complexity into the system (Tesler), simplify visual forms (Prägnanz), emphasize the most important element without competing accents (Von Restorff), put key items at sequence ends (serial position), and prioritize the small set of work with highest user impact (Pareto).
- Keep input tolerant and normalize output (Postel); make related items visibly connected (uniform connectedness); polish can improve perceived usability but never substitutes for operability or evidence.

## Predictive prefetching

Prefetch only when latency is noticeable and the active framework/router supports safe prefetching. Predict likely intent from pointer trajectory rather than fetching every visible link or on every hover; expand the prediction hit area with the framework's supported hit-slop option. Keyboard focus approaching a link is an intent signal too. On touch, use a deliberate no-pointer fallback such as focus or a modest, bounded proximity rule; do not predict every destination. Keep actual navigation available if speculative work is unavailable or cancelled.

## Morphing icons

Use a morphing icon only when the project already draws linear icons and the icon switches between two states that read as the same object; a swap between unrelated shapes is a cross-fade (see [interface-defaults.md](interface-defaults.md)). When morphing, every icon in the set shares one viewBox and the same three-line structure, an unused line collapses to a single constant, rotational variants reuse one group, stroke line caps are round, rotation uses the project's spring primitive, and reduced motion falls back to the end state. The icon itself is decorative: it carries `aria-hidden="true"` and the control keeps its own accessible name.

## Typography and visual treatment

Prefer oldstyle numerals in prose and lining/tabular figures in data; enable contextual alternates (`calt`) when the face supports them, and diagonal fractions where real fractional text benefits. Do not synthesize weights or stylistic features the font does not provide. Optical sizing and variable weights follow the chosen face and design tokens. Keep heading and body wrapping suitable for their role, underline offsets clear of descenders, and pair justified text with hyphenation when the language supports it. For uppercase labels, use restrained tracking only where the typeface and script support it. Retina smoothing is optional platform tuning, never a substitute for a suitable font.

Use the elevation and spacing tokens first. Shadows share a light direction, use layered low-opacity depth rather than a single dark smudge, and remain subordinate to readable contrast. Semi-transparent borders adapt to both themes. Animate a shadow through a pseudo-element opacity layer rather than repeatedly repainting a large shadow. Six-layer button shadow anatomy is an optional authored style, not a default: only use it where the project surface and contrast contract support every layer.

## Rule inventory

The complete pinned inventory and one-to-one mapping from upstream rule filenames are in [ui-rule-coverage.json](ui-rule-coverage.json). The inventory records rules that this project deliberately does not adopt and audio rules assigned to #360 separately.
