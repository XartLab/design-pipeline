## Why

The owner's rule is that a fast check which cannot finish within one minute is a bug. The browser half of
`template check` takes five screenshots per text unit (black, white, isolated black, isolated white, ground), and
on a tall kit page the screenshots dominated: `tests/template-institute-essay.test.cjs` (123 text units on an
8090 px page, two widths and nine default renders) took 83 s on a 2-core box, and the sibling pack tests 31-53 s.
Profiling showed the time was in the screenshots, not in the analysis: each clip cost about 118 ms (Chrome
re-laid the page out for every shot taken "beyond the viewport", and capped frames at 60 Hz), and switching the
whole page between measurement states repainted every filtered figure on it three times per unit.

## What Changes

- Screenshots are taken with `captureBeyondViewport: false`. The viewport is already the whole canvas and every
  clip lies inside it, so nothing is captured beyond it; the shots are the same pixels, about twice as fast on a
  tall page.
- Chrome is launched with `--disable-frame-rate-limit --disable-gpu-vsync` (`FAST_FRAMES`, exported from
  `page-check.cjs` and used by `tests/helpers/kit-browser-check.cjs`), so a screenshot no longer waits for a
  60 Hz frame.
- The measurement states are taken one after another over all units (ink, isolated ink, ground) instead of all
  three per unit, and `setState` writes only the attributes that change, so switching the page between states
  happens three times, not three times per unit.
- Units whose regions are 8 px or more apart are measured in one batch: the state is set once with each of them
  keyed, and each region is cropped from the shared shots. Regions that sit close together share one screenshot
  (at most 600 px tall, at most 4 times the area of the regions it serves) that is cropped back to each region.
- No new rule, finding code, flag, receipt or schema. What the check measures and reports is unchanged.

## Capabilities

- `design-pipeline`: ADDED `Template check measures a page quickly without changing what it measures`.

## Reuse

- `checkPage`, `discover`, `diffMask` and the contrast loop in `skill/tools/template-bank/page-check.cjs`;
  `tests/helpers/kit-browser-check.cjs` for the five pack tests. The repository test files are unchanged by this
  change except that they now pass quicker.
