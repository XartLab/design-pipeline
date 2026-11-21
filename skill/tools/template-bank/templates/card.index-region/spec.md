# card.index-region

Region detail: a serif name over a hairline, a serif rank over a 31-cell strip, a serif index over a bar with an expected mark, tabs and a six-row list, and a treemap of pastel tiles.

Style: `index-explorer` (`styles/index-explorer/style.json`). The detail of one region (or one sector): rank among 31, index value and the breakdown of its attention. rank and index are parameters; the numerals, the strip, the bar and the shares (from seed) agree.

## Where it comes from

The data page's state and country detail re-set: rank strip, index bar with its expected mark, tabs, ranked list, treemap. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy and data are our own placeholders.

Samples: index-explorer/region.

- Name serif 48 / 57.6; numerals serif 32 / 38.4; strip cells 10 x 24 on a 1 px gap in rgba(188,209,202,.75), the region's cell #6A9BCC; index bar 24 high; tabs serif 18 / 500 with a 2 px underline; ten ranked rows; a treemap of pastel tiles.
- Template: every rank 1-31 and index 0.1-6 pass; the treemap never leaves its panel.

## Relations to keep

- The left column is 704 wide: a serif 64 name over a hairline, a serif 52 numeral beside a 31-cell strip (14 x 36 cells on a 2 gap, the region's cell blue), an index bar 36 high scaled 0-6 with a 1.5 ink mark at 1.0, serif 22 tabs (the first underlined) and six 52-high rows.
- The treemap fills a 576 x 610 area of the right panel, squarified, each tile 1 unit inset; its colours are the list's dots in the same order.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `name` | text | 8 | serif | 广东 |
| `rank_value` | text (derived) | 8 | serif | from the parameter |
| `rank_label` | text | 8 | sans | 热度排名 |
| `index_value` | text (derived) | 8 | serif | from the parameter |
| `index_label` | text | 8 | sans | 热点指数 |
| `expected` | text | 8 | sans | 预期 1.0 |
| `tab_1` | text | 8 | serif | 最热板块 |
| `tab_2` | text | 8 | serif | 最特别板块 |
| `list_title` | text | 20 | sans | 广东最常被关注的板块。 |
| `item_1` | text | 8 | sans | 半导体 |
| `item_2` | text | 8 | sans | 新能源 |
| `item_3` | text | 8 | sans | 人工智能 |
| `item_4` | text | 8 | sans | 医药生物 |
| `item_5` | text | 8 | sans | 消费电子 |
| `item_6` | text | 8 | sans | 券商 |
| `pct_1` | text (derived) | 8 | mono | from the parameter |
| `pct_2` | text (derived) | 8 | mono | from the parameter |
| `pct_3` | text (derived) | 8 | mono | from the parameter |
| `pct_4` | text (derived) | 8 | mono | from the parameter |
| `pct_5` | text (derived) | 8 | mono | from the parameter |
| `pct_6` | text (derived) | 8 | mono | from the parameter |
| `tree_title` | text | 8 | sans | 关注结构 |
| `tree_hint` | text | 24 | sans | 面积为关注占比，颜色对应左侧列表 |
| `tree_note` | text | 32 | sans | 关注占比之和因隐私过滤不到 100%。示例数据。 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground; tile names and the tooltip keep their fixed inks |
| `rank` | proportion | 1-31 | 2 | rank among 31 |
| `index` | proportion | 0.1-6 | 3.32 | the index value, 1.0 = expected |
| `seed` | decoration | 1-9999 | 9 | seeds the six shares |

## Decoration

- The strip, bar, mark, dots, panel and treemap tiles are decoration; row numbers are real text.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
