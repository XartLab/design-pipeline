# brand-band: an AI-lab corporate site's band-and-illustration grammar as a style pack, an original illustration kit and an HTML product-site kit

## Why

The owner named public pages of an AI lab's corporate site (a home page, a news article page and a careers page)
as the lineage for product sites and asked for the same look in their own projects: a cream-to-black band
rhythm, an editorial serif, and above all the hand-drawn organic illustrations on flat colour squares. We
captured and measured the pages in Chrome (computed styles, 2026-11-21; the captures stay private and nothing
from them is shipped). The bank has packs for essays and a developer blog but no marketing-site grammar, and no
way to make a picture: every pack that wants an illustration either leaves an image slot or draws geometry.
The look rests on the pictures: a black marker line of varying width, a few flat off-register fills and a lot of
empty field. Without a drawing kit the next product site starts from stock icons, which is exactly the thing
the grammar is not.

## What Changes

- **Style pack `brand-band`** in `skill/tools/template-bank/styles/brand-band/style.json` in the existing
  `design-pipeline.template-bank-style.v1` shape: a serif role (Newsreader, Source Serif 4, Noto Serif SC) and a
  sans role (Hanken Grotesk, Inter, Noto Sans SC) with catalog fallbacks, the measured palette (ivory, oat,
  near-black, ink, greys, five field hues, olive and clay accents), layout grammar with the measured numbers,
  materials (marker ribbons, crayon line filter, flat misregistered fills), motion grammar, checks with
  guidance, provenance ("borrow grammar, never assets") and the kit as its example. It names no organisation
  and uses none of the originals' proprietary faces, logos, wordmarks or pictures.
- **Illustration kit** `skill/tools/template-bank/illustrations-band.cjs`: eight original subjects in a
  400-unit box (hand-graph, seedling, book, magnifier, spark-hands, path, candles, compass), deterministic. A
  stroke is a filled ribbon around a Catmull-Rom centre line (width swells in the middle, blunt rounded ends,
  low-frequency wobble, closed shapes overshoot their start); fills are flat shapes nudged off their lines.
  The kit returns `d` (outline) and `c` (centre line) per stroke, so the layouts paint the outline and the HTML
  kit masks it along `c` to draw it in.
- **Six templates** rendered from parameters with original copy: `kv.band-hero`, `card.band-features`,
  `banner.band-black-statement`, `cover.band-article`, `card.band-social` (1200 x 630) and
  `banner.band-cta-row` (1600 x 600); `subject` (0-7) and `field` (sage, blush, lilac, sky, sand) pick the
  picture and its colour.
- **HTML kit** `examples/brand-band-site-kit/`: one self-contained Chinese product page for the owner's quant
  system (research, backtesting, live monitoring; sample copy, no customers, quotes or metrics) with the band
  rhythm ivory, oat, near-black, ivory, oat, black footer; all eight pictures are the library's own output;
  strokes draw in on scroll, cards lift on hover, blocks fade up, nav pills switch to dark over a black band;
  all of it off under `prefers-reduced-motion`; with a README.
- No change to `template check`, its rules, schemas, gates or CLI flags.

## Capabilities

- `design-pipeline`: the template bank gains one style pack and six templates and an illustration module; the
  examples gain one kit.

## Reuse

- `template list|render|check`, the style and manifest schemas, `Doc.text`/`Doc.zone`/`Doc.def`, `f1` from
  `layout-kit.cjs`, `measure.textWidth` and `measure.wrapText` for pill widths and line counts, the `BankError`
  codes and exit codes 0 / 2 / 1, `tests/helpers/kit-browser-check.cjs` for the kit and the default renders.

## Impact

- New: `tools/template-bank/illustrations-band.cjs`, `layouts-band.cjs`, `styles/brand-band/style.json`, six
  template folders, `tests/template-brand-band.test.cjs`, `examples/brand-band-site-kit/`.
- Changed: `bank.cjs` (layout registry list), `references/template-bank.md`, `package-resources.json`,
  `scripts/test-manifest.json`, `CHANGELOG.md`; counts in `tests/template-bank.test.cjs` and
  `tests/template-style-pack.test.cjs`.
