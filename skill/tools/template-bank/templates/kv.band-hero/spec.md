# kv.band-hero

Hero band: nav pills and a centred wordmark, a two-line serif headline, a deck, an ink and a ghost button, a square colour field with one hand-drawn picture, an oat strip of three labels.

Style: `brand-band` (`styles/brand-band/style.json`). The first screen of a product or lab site; subject picks the picture, field its colour, tile its size.

## Where it comes from

The measured home hero re-set on 1600 x 900: pill nav, serif statement, a square colour field with a small drawing; sizes scaled from the measured 47.8 px statement and 13 px pills. Borrow grammar, never assets: the public reference pages are private and nothing from them is shipped; every picture is our own code-drawn illustration and all copy is our own placeholder.

Samples: brand-band/hero.

- Nav 84 px high on the ivory ground with 13 px pills (radius full, #F5F4ED, 1 px #E8E6DC), a centred wordmark; statement serif 47.8 / 59.7; ink button 17 px, padding 12 x 24, radius 10.
- Template: eight pictures and five fields pass the static check; the default passes --browser.

## Relations to keep

- Nav 28 units from the top: pills 34 high (15 sans, paper fill, 1 unit hairline), wordmark centred in bold tracked sans 24; the headline is serif 78 at weight 400, two lines at 94 units, the deck 20 sans in 600 units, then an ink 10 unit button 52 high and a flat grey one.
- The colour field is 560 units square (times tile) right of the copy, inset 80 from the right edge, the picture 82% of it; the oat strip is the bottom 100 units with a clay dot and a 16 sans label per third.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `nav_1` | text | 6 | sans | 研究 |
| `nav_2` | text | 6 | sans | 回测 |
| `nav_3` | text | 6 | sans | 实盘 |
| `nav_cta` | text | 6 | sans | 文档 |
| `brand` | text | 12 | sans | FIELDNOTE |
| `title_1` | text | 8 | serif | 把想法变成 |
| `title_2` | text | 8 | serif | 可复现的策略 |
| `deck` | text | 50 | sans | 从研究、回测到实盘监控，一个工作台留下每一步的证据。 |
| `cta_1` | text | 8 | sans | 开始使用 |
| `cta_2` | text | 8 | sans | 查看方法 → |
| `meta` | text | 30 | sans | 示例站点 · 文案为占位 |
| `strip_1` | text | 16 | sans | 研究：把假设写下来 |
| `strip_2` | text | 16 | sans | 回测：证据可复现 |
| `strip_3` | text | 16 | sans | 实盘：状态看得见 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `field` | decoration | sage / blush / lilac / sky / sand | sage | the colour field behind the picture |
| `subject` | rhythm | 0-7 | 0 | which picture: 0 hand-graph, 1 seedling, 2 book, 3 magnifier, 4 spark-hands, 5 path, 6 candles, 7 compass |
| `tile` | proportion | 0.7-1.1 | 1 | size of the colour field (1 = 560 units) |

## Decoration

- The colour field, the picture and its crayon line filter, the clay dots; the text slots are the only measured content.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
