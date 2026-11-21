# card.index-stats

Stat tiles: four white cards, each a bold label, a serif numeral, a delta with a triangle and a note, and a sparkline with a coral end dot.

Style: `index-explorer` (`styles/index-explorer/style.json`). A row of headline numbers. value_1..4 and delta_1..4 are parameters; the numeral and the delta text are derived from them and the triangle follows the sign.

## Where it comes from

The data page's side cards and detail numerals re-set as four stat tiles with sparklines. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy and data are our own placeholders.

Samples: index-explorer/stats.

- Card white, 1 px #C9C4C4, radius 16; bold sans 14 title; serif 32 / 38.4 numerals; mono values.
- Template: numeral and delta come from parameters; checked at both sizes, light and dark.

## Relations to keep

- Cards 340 x 400, radius 16, white with a 1 hairline, on a 16 gap; a bold 17 label, a serif 76 numeral, a delta line (a 16-wide triangle, mono 20, a sans 16 note) and a 110-high sparkline.
- The triangle is the scale green when the delta is not negative and coral when it is; the delta text is always ink.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `title` | text | 10 | serif | 今日市场热点概览 |
| `lede` | text | 36 | sans | 全市场与三个重点板块的热点指数，以及相对上周的变化。示例数据。 |
| `label_1` | text | 10 | sans | 全市场热点指数 |
| `label_2` | text | 10 | sans | 半导体热度 |
| `label_3` | text | 10 | sans | 新能源热度 |
| `label_4` | text | 10 | sans | 地产链热度 |
| `value_1` | text (derived) | 8 | serif | from the parameter |
| `value_2` | text (derived) | 8 | serif | from the parameter |
| `value_3` | text (derived) | 8 | serif | from the parameter |
| `value_4` | text (derived) | 8 | serif | from the parameter |
| `delta_1` | text (derived) | 8 | mono | from the parameter |
| `delta_2` | text (derived) | 8 | mono | from the parameter |
| `delta_3` | text (derived) | 8 | mono | from the parameter |
| `delta_4` | text (derived) | 8 | mono | from the parameter |
| `note_1` | text | 6 | sans | 较上周 |
| `note_2` | text | 6 | sans | 较上周 |
| `note_3` | text | 6 | sans | 较上周 |
| `note_4` | text | 6 | sans | 较上周 |
| `caption` | text | 36 | sans | 示例数据 · 折线为近 28 日走势 · 圆点为最新值 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground; tile names and the tooltip keep their fixed inks |
| `convention` | decoration | intl / cn | intl | intl (default, the measured lineage): green heat scale, rising green, falling coral; cn (红涨绿跌, Chinese markets): red heat scale from light to deep, rising red, falling green; the delta triangles, the sparkline and its end dot follow it (red up, green down) |
| `value_1` | proportion | 0.1-9 | 1.26 | tile 1's index value |
| `value_2` | proportion | 0.1-9 | 2.31 | tile 2's index value |
| `value_3` | proportion | 0.1-9 | 0.84 | tile 3's index value |
| `value_4` | proportion | 0.1-9 | 3.05 | tile 4's index value |
| `delta_1` | proportion | -60-60 | 3.2 | tile 1's change, percent (a negative one draws a coral down triangle) |
| `delta_2` | proportion | -60-60 | 12.8 | tile 2's change, percent (a negative one draws a coral down triangle) |
| `delta_3` | proportion | -60-60 | -6.4 | tile 3's change, percent (a negative one draws a coral down triangle) |
| `delta_4` | proportion | -60-60 | 1.1 | tile 4's change, percent (a negative one draws a coral down triangle) |
| `seed` | decoration | 1-9999 | 21 | seeds the sparklines |

## Decoration

- The cards, the triangles, the sparklines (line, area, baseline, end dot) are decoration.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
