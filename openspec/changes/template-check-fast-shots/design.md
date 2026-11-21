# Design

## Decisions (made without asking)

- **Profile before changing anything.** On `examples/institute-essay-report-kit` at 1440 wide (page 8090 px,
  123 text units, 616 screenshots): 78 s in the unit loop, 72 s of it inside `page.screenshot`; the PNG decode
  was 0.9 s and the state writes 2 s. So the lever was the cost of one screenshot, not the analysis.
- **A screenshot beyond the viewport re-lays the page out.** The helper sets the viewport to the page height, so
  every clip is inside the viewport; `captureBeyondViewport: false` takes the same pixels (verified below) at
  about half the cost on a tall page (153 ms to 62 ms for a small clip). It is correct for every caller because
  `checkPage` clamps each region to the canvas it sized the viewport to.
- **Frame pacing is not a measurement.** `--disable-frame-rate-limit --disable-gpu-vsync` took a small clip from
  58 ms to 37 ms; pixels are unchanged. The flags are added to both Chrome launches (the CLI's and the test
  helper's) from one constant.
- **Do the three states in three passes.** Switching the page between "all text hidden, one unit keyed", "the
  same, everything else hidden" and "only this unit hidden" restyles and repaints the whole page, which on a
  page with filtered artwork (a crayon burst, turbulence on tiles) is most of a screenshot's cost. Per unit that
  was three switches; as passes it is three in total, and within a pass only the key moves.
- **Write only what changes.** `setState` used to remove and set `data-tc-*` attributes on every unit for every
  shot; a write of an unchanged value still invalidates style. It now compares first.
- **Batches and clusters are exact, not approximate.** A unit's pixels inside its own region (its layout box
  grown by a quarter em) cannot change when another unit elsewhere changes, so units whose regions are 8 px or
  more apart share a state. Close regions share one screenshot cropped back to each region, which is the same
  pixels as a screenshot of that region. Regions that overlap (a small label over a giant glyph) never share a
  batch, so "small text over a giant glyph is measured against that glyph" still holds.
- **Not done**: no viewport shrinking (page height drives viewport units such as `vh`, which the kits cap with
  `min()`), no lowered quality, no skipped units, no cached results between runs, no change to thresholds.

## Evidence

- Equal results: the full `checkPage` reports of the five pack kits at 1440 and 390 wide (ten reports) were
  compared as JSON, before and after, each in its own Chrome. Six are byte-identical. In the institute-essay kit
  at 1440 wide, eleven decorative axis labels (`data-deco`) had no ink box before: the old beyond-viewport
  screenshots did not paint them, and the old code with only `captureBeyondViewport: false` gives a report
  identical to the new one, so the new ink boxes are the labels as drawn. In the brand-band kit four ink boxes
  differ by one pixel on an antialiased edge. No finding, no contrast value and no other field changed in any
  report (all report none).
- Timings of the five pack test files on a 2-core box, one at a time, before and after (seconds):
  devlog-terminal 34 to 20, institute-essay 83 to 34, brand-band 31 to 22, circuits-paper 53 to 29,
  index-explorer 35 to 34 (that file also gained the colour-convention coverage of change
  `index-explorer-style-pack`: a toggle test and two more browser renders, and the kit page grew 31 text units).
- The page-check consumers still pass: `template-bank-browser`, `template-hue-budget`, `composite-layers` and
  `template-style-pack` test files.

## Compatibility

No schema, rule, gate, receipt or CLI change. Reports are the same shape and, for pages checked, the same values.
