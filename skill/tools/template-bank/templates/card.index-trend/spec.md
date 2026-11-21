# card.index-trend

Trend: underlined serif tabs, three bottom-ruled filter controls and a line chart on a panel with a dashed expected line and direct labels at the line ends.

Style: `index-explorer` (`styles/index-explorer/style.json`). A time series with filters. --param active picks the underlined tab; seed and volatility shape three seeded series; the expected line is at 1.0.

## Where it comes from

The data page's tabs, filter row and country time view re-set as one trend card. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy and data are our own placeholders.

Samples: index-explorer/trend.

- Tabs serif 18 / 27.9 weight 500, the active one ink with a 2 px underline; selects 140 x 23 with a bottom rule; the 'Expected: 1' mark.
- Template: labels never touch at any seed; checked at both sizes, light and dark.

## Relations to keep

- Tabs serif 24 / 500 on a 36 gap, the active one ink with a 2 underline, the others #5E5D59, a 1 hairline under the row; controls 300 wide on a 340 pitch (a bold 13 label, an 18 value, a rule and a chevron).
- The panel is 1408 x 478, radius 8; the plot is 1100 x 370 with 1 hairline gridlines at every whole value; end labels are pushed 28 apart so none touch, the expected line is labelled the same way.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `title` | text | 10 | serif | 板块热度走势 |
| `tab_1` | text | 6 | serif | 热点指数 |
| `tab_2` | text | 6 | serif | 关注占比 |
| `tab_3` | text | 6 | serif | 异动次数 |
| `filter_label_1` | text | 6 | sans | 地区 |
| `filter_label_2` | text | 6 | sans | 板块 |
| `filter_label_3` | text | 6 | sans | 周期 |
| `filter_value_1` | text | 8 | sans | 全部地区 |
| `filter_value_2` | text | 8 | sans | 三个重点板块 |
| `filter_value_3` | text | 8 | sans | 近 60 日 |
| `series_1` | text | 6 | sans | 半导体 |
| `series_2` | text | 6 | sans | 新能源 |
| `series_3` | text | 6 | sans | 地产链 |
| `expected` | text | 8 | sans | 预期 1.0× |
| `x_1` | text | 10 | sans | 9 月 24 日 |
| `x_2` | text | 10 | sans | 10 月 12 日 |
| `x_3` | text | 10 | sans | 10 月 30 日 |
| `x_4` | text | 10 | sans | 11 月 21 日 |
| `caption` | text | 44 | sans | 示例数据 · 虚线为预期水平 1.0× · 每日收盘后更新 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground; tile names and the tooltip keep their fixed inks |
| `active` | decoration | 1-3 | 1 | the active tab (1-3) |
| `seed` | decoration | 1-9999 | 3 | seeds the three series |
| `volatility` | rhythm | 0.02-0.4 | 0.12 | the size of a day's move |

## Decoration

- The panel, gridlines, series lines, end dots, chevrons and underline are decoration; tick labels are real text.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
