# card.band-features

Feature cards: three paper cards, each a colour field with one picture, a bold title, one sentence and an arrow link, under a serif heading.

Style: `brand-band` (`styles/brand-band/style.json`). Three things a product does; field_start and subject_start rotate the fields and pictures.

## Where it comes from

The measured card row (571 x 426, radius 16, padding 32, gap 24) with the oat band's colour-field tile pulled into each card; titles bold 22 scaled to 24. Borrow grammar, never assets: the public reference pages are private and nothing from them is shipped; every picture is our own code-drawn illustration and all copy is our own placeholder.

Samples: brand-band/features.

- Cards #F5F4ED, radius 16, padding 32, title bold 22 / 27.5, body 15 / 22.5 #3D3D3A, tile #BCD1CA.
- Template: every subject and field offset passes the static check.

## Relations to keep

- Three cards 464 x 650 with a 24 gap and 80 inset, paper #F5F4ED, radius 16, padding 32; each has a 400-unit square field with its picture at 80%, a bold 24 title 56 units under it, a 16 sans body in two lines and a 16 medium link at the foot.
- Fields cycle sage, blush, lilac, sky, sand from field_start; pictures run from subject_start; a flat accent never matches its field.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `heading` | text | 24 | serif | 一个工作台，三件事 |
| `lede` | text | 40 | sans | 每一步都留下证据，换一个人也能重跑。 |
| `title_1` | text | 12 | sans | 研究 |
| `title_2` | text | 12 | sans | 回测 |
| `title_3` | text | 12 | sans | 实盘监控 |
| `text_1` | text | 46 | sans | 把假设、数据口径和因子写在同一处，改动有记录。 |
| `text_2` | text | 46 | sans | 同一份配置能重跑，结果带着参数和随机种子。 |
| `text_3` | text | 46 | sans | 持仓、延迟和风控状态在一个面板里。 |
| `link_1` | text | 10 | sans | 了解研究 → |
| `link_2` | text | 10 | sans | 了解回测 → |
| `link_3` | text | 10 | sans | 了解监控 → |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `field_start` | rhythm | 0-4 | 0 | field of the first card (sage, blush, lilac, sky, sand; the rest follow) |
| `subject_start` | rhythm | 0-7 | 1 | which picture: 0 hand-graph, 1 seedling, 2 book, 3 magnifier, 4 spark-hands, 5 path, 6 candles, 7 compass |

## Decoration

- The cards, the fields and the pictures with their line filter; the text slots are the only measured content.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
