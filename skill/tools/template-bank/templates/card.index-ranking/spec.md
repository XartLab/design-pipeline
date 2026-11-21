# card.index-ranking

Ranking: two columns of five hairline rows, each a mono number, a sans name, an inline bar (an ivory box with a 1 ink border and a green fill) and a mono value.

Style: `index-explorer` (`styles/index-explorer/style.json`). A sector or region ranking. top, spread and seed make a descending series; the bar and the value text come from the same number, and the rows are already in rank order (name_1 is the first).

## Where it comes from

The data page's 'in view' list re-set as two columns of five rows with inline bars. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy and data are our own placeholders.

Samples: index-explorer/ranking.

- Row 23 px high, bottom rule #D1CFC5, mono 13 rank #5E5D59, sans 14 name, mono 14 value; the bar box 71 x 16 on the ground with a 1 px ink border and a green fill.
- Template: value and bar share one parameter set; checked at both sizes, light and dark.

## Relations to keep

- Rows 70 units high with a 1 hairline under each; a mono 16 number, a sans 21 name at +52, a 190 x 22 bar at +330 and a mono 21 value right-aligned at 640; two columns 128 apart.
- The bar's fill is the scale class of its rank group (rows 1-3 leading, 4-5 upper middle, 6-8 lower middle, 9-10 emerging); the box is ivory with a 1 ink border.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `title` | text | 10 | serif | 板块热度排名 |
| `lede` | text | 36 | sans | 10 个板块的热点指数，1.0 为按成交占比的预期水平。示例数据。 |
| `group_title` | text | 8 | sans | 板块热度 |
| `group_title_2` | text | 10 | sans | 板块热度（续） |
| `name_1` | text | 6 | sans | 半导体 |
| `name_2` | text | 6 | sans | 新能源 |
| `name_3` | text | 6 | sans | 人工智能 |
| `name_4` | text | 6 | sans | 医药生物 |
| `name_5` | text | 6 | sans | 消费电子 |
| `name_6` | text | 6 | sans | 券商 |
| `name_7` | text | 6 | sans | 白酒 |
| `name_8` | text | 6 | sans | 军工 |
| `name_9` | text | 6 | sans | 有色金属 |
| `name_10` | text | 6 | sans | 银行 |
| `value_1` | text (derived) | 6 | mono | from the parameter |
| `value_2` | text (derived) | 6 | mono | from the parameter |
| `value_3` | text (derived) | 6 | mono | from the parameter |
| `value_4` | text (derived) | 6 | mono | from the parameter |
| `value_5` | text (derived) | 6 | mono | from the parameter |
| `value_6` | text (derived) | 6 | mono | from the parameter |
| `value_7` | text (derived) | 6 | mono | from the parameter |
| `value_8` | text (derived) | 6 | mono | from the parameter |
| `value_9` | text (derived) | 6 | mono | from the parameter |
| `value_10` | text (derived) | 6 | mono | from the parameter |
| `note` | text | 40 | sans | 示例数据 · 指数大于 1 表示高于预期 · 条形按最大值缩放 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground; tile names and the tooltip keep their fixed inks |
| `convention` | decoration | intl / cn | intl | intl (default, the measured lineage): green heat scale, rising green, falling coral; cn (红涨绿跌, Chinese markets): red heat scale from light to deep, rising red, falling green; the bars' four classes follow it |
| `top` | proportion | 1.5-6 | 3.4 | the first row's value |
| `spread` | proportion | 0.2-0.9 | 0.7 | how far the last row falls below the first |
| `max` | proportion | 1-8 | 3.6 | the value at the end of a bar |
| `seed` | decoration | 1-9999 | 5 | jitters the series |

## Decoration

- The row hairlines, the bar boxes and fills are decoration; the row numbers are real text.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
