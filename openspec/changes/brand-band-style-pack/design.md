# Design

## Decisions (made without asking)

- **Named by the grammar, never the source**: `brand-band`; templates are named by what they are
  (`kv.band-hero`, `banner.band-black-statement`). No file, test, commit or PR names an organisation, product,
  logo or wordmark; the lineage line is a generic genre description. The pages stay with the owner; the pack
  carries only numbers measured on them.
- **Measured numbers (private capture, Chrome, 2026-11-21, 1920 wide, three corporate
  pages: home, a model announcement, a news article, a careers page)**:
  - Ground #FAF9F5, ink #141413, body on cards #3D3D3A, secondary #5E5D59, small text on black #B0AEA5,
    paper card #F5F4ED, oat band #F0EEE6, light grey #E8E6DC, grey #DEDCD1; the model page's hero #0D0C0B,
    the footer #141413 (628 tall). They match the public brand palette (dark #141413, light #FAF9F5, mid grey
    #B0AEA5, light grey #E8E6DC; accents orange, blue, green): #D97757 clay, #6A9BCC sky, #788C5D olive.
  - Field hues behind the pictures (palette tokens read from the page): sage #BCD1CA, blush #EBCECE, lilac
    #CBCADB, sky #6A9BCC (the carousel's colour squares sampled #BCD1CA, #EBCECE, #CBCADB-ish and #6A9BCC),
    sand #E3DACC.
  - Type: home statement serif 47.8 / 59.7 weight 400, -1% tracking; section serif 32 / 38.4; article lede
    serif 28 / 36; careers lede serif 22 / 31.9; body serif 17 / 26 in a 720 column; card titles bold
    grotesque 22 / 27.5; article H1 bold 35.9 / 40.9, centred; careers H1 bold 60.7 / 65.6; labels 13-15; tag
    13 px bold, .13 px tracking; footer links 13 px.
  - Layout: 84 px sticky nav on ivory (pills left, wordmark centred, pills right); content inset 80 px; three
    cards 571 x 426, radius 16, padding 32, gap 24; the oat band inset with 64 px vertical padding and square
    corners, heading left, a 466 px square colour field with its picture and a title with a 15 / 22.5 body to
    its right plus a counter and two arrow buttons; article figure radius 4; the footer black with 13 px links.
  - Controls: nav pills radius full, 13 px, padding 8 x 16, 28 high, #F5F4ED fill, 1 px #E8E6DC, text #3D3D3A
    (on black #262624, #3D3D3A, #FAF9F5); primary button #141413 on #FAF9F5 text 17 px, padding 12 x 24, radius
    10, 36 high; secondary a flat grey with an arrow.
  - Pictures (observed on the careers carousel of seven): a flat colour square, one small drawing about a third
    of the field, a black line about 1% of the field wide with round ends and variable width, objects as flat
    ivory shapes without an outline, hands as a few parallel finger strokes, an occasional flat accent offset a
    few units from its line.
  - Motion: items fade in on scroll (opacity .25-.3 s), colour .2 s ease-out, background .2 s ease, transform
    .15 s ease-out on 39 hover rules; a carousel with arrows and a counter.
- **One page was out of reach**: the product page named in the brief redirected to another domain, which the
  browser was not permitted to act on, so it was left out and not worked around; the model announcement page on
  the same site (a black hero, an ivory article, a bordered table) stood in for it. The home page's hero is a
  video, so the band rhythm was read from the careers page (ivory, oat band, ivory, black footer), the model
  page (black hero, ivory body) and the footer.
- **Drawn by code, not traced**: the subjects are our own (a hand with a node graph, a seedling, an open book,
  a magnifier over a waveform, two hands passing a spark, a mountain path, candles growing leaves, a compass);
  none of the originals' subjects is reproduced. Only grammar is borrowed: flat square, marker line, off-register
  flat fills, mostly empty field.
- **A ribbon, not a stroke**: a constant-width `stroke` reads as an icon. Every stroke is a polygon around a
  Catmull-Rom centre line with a width that swells and tapers; closed shapes overshoot their start and drift by
  a hair; the centre line gets a low-frequency wobble. Everything is seeded by the subject, so a render is
  byte-stable. Strokes also carry their centre line `c`, which the HTML kit masks to draw them in.
- **Hands are silhouettes**: the first attempt drew hands as open lines and read as scribbles; a hand is now one
  closed silhouette (cuff, thumb, four stacked fingers with notches) filled flat ivory with a few seam strokes,
  mirrored for the other hand.
- **Crayon line, flat fills**: only strokes pass through the line filter (a fine displacement and a
  paper-tooth alpha mask in the picture's own 400 units, region 180% so thin strokes are not clipped); fills stay
  flat, like an off-register print. The filter is defined once per render (`band-line`).
- **Own faces, not theirs**: the originals are proprietary. The pack names Newsreader (a warm editorial serif)
  and Hanken Grotesk, with Source Serif 4 / Inter fallbacks and Noto Serif SC / Noto Sans SC for CJK; every
  stack holds a catalog family. Roles are named `serif` and `sans` so the layout engine measures wrapped slots
  with the same model as the check. Fonts are named, not bundled.
- **Placement follows the measured line count**: a headline's line count decides where the buttons, deck or
  subline sit (`rows()` over `measure.wrapText`), so a one-line statement does not leave a hole.
- **The accent never matches its field**: a picture's olive and sky accents become clay on an olive field and
  clay on a sky field; clay is small marks only (2.96:1).
- **The kit's pictures are the library's output**: the HTML embeds `classBody(id)` verbatim; the test finds each
  of the eight once, so the page and the templates cannot drift. The page keeps `<details open>`: the browser
  check measures the text of a closed one (it still has a layout box) against the rows below it.
- **Fast checks**: the static runs (every size, 8 subjects x 5 fields, 50 seeds, variants) stay under 45 s as a
  test assertion; each kit width runs once in its own Chrome in parallel with the static tests; the default
  renders share one Chrome (`tests/helpers/kit-browser-check.cjs`).

## Evidence

- Measurement: computed styles of the pages in Chrome on 2026-11-21 (private), sizes above.
- Templates: every default render, each listed size, every subject and field combination and 50 seeds pass the
  static check; the default renders pass `template check --browser`.
- Kit: `template check examples/brand-band-site-kit/index.html --browser` at 1440 and 390 wide, 0 findings.

## Compatibility

Additive. No schema, rule, gate, receipt or CLI change; other templates' renders are unchanged.
