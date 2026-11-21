# ui.devlog-article-header

Article header: a centred clay pixel tile, the title, a deck and three meta columns with mono labels.

Style: `devlog-terminal` (`styles/devlog-terminal/style.json`). The top of an article or a post card: tile icon, 36-unit title, deck, then AUTHOR / CATEGORY / PUBLISHED between two hairlines. glyph picks the tile's pixel glyph.

## Where it comes from

The article header re-laid at 1440 x 560: centred tile, title 36/1.2, deck, three meta columns. Borrow grammar, never assets: the reference blog was read privately and nothing from it is shipped; all copy is the case's own original text (benchlog), the pixel glyphs are drawn here and the mascot is an empty image slot.

Samples: benchlog/article-header.

- Reference: article title sans 36 px / 1.2 w500; meta labels mono AUTHOR / CATEGORY / PUBLISHED.
- Tile is the pack's own 9 x 9 glyph on clay; the reference's mascot-like pixel figure is not drawn.

## Relations to keep

- Tile 80 units centred at y 64; title sans 36 / 1.2 w500 centred, two lines at most; deck sans 18 / 1.6 body grey.
- Three 240-unit meta columns centred on the canvas between hairlines at y 392 and 484, separated by vertical hairlines; labels mono small caps, values sans 15.75.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `title` | text | 64 | title | Why our flaky tests were really a scheduling bug |
| `deck` | text | 140 | sans | We stopped retrying failures and started asking what each one assumed. Here is what the traces told us. |
| `meta_label_{i}` | text | 14 | mono | AUTHOR / CATEGORY / PUBLISHED |
| `meta_{i}` | text | 22 | sans | Ines Calder / Engineering / 2026.11.18 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `glyph` | decoration | bug / check / flask / chart / prompt / bolt | bug | pixel glyph of the tile |

## Decoration

- Hairlines and the pixel glyph: drawn.

Sizes: 1440x560, 2880x1120. A passing check is technical conformance only, not visual acceptance.
