# banner.band-black-statement

Near-black band: a small tracked label, a big ivory serif statement in up to three lines, an ivory button and a ghost button, a hairline footer row, an optional small field with a picture.

Style: `brand-band` (`styles/brand-band/style.json`). The statement band that closes an argument or opens a section; show_tile turns the small picture on or off.

## Where it comes from

The measured near-black product hero (#0D0C0B) and the black footer (#141413) with its #B0AEA5 13 px links, merged into one statement band; the statement is the 47.8 px serif scaled up. Borrow grammar, never assets: the public reference pages are private and nothing from them is shipped; every picture is our own code-drawn illustration and all copy is our own placeholder.

Samples: brand-band/black-statement.

- Hero ground rgb(13,12,11), nav pills on it #262624 / #3D3D3A / #FAF9F5; footer #141413 with #B0AEA5 13 px links.
- Template: three lines of 14 characters each fit; ivory on #0D0C0B is 18:1, #B0AEA5 on it 8.4:1.

## Relations to keep

- Ground #0D0C0B edge to edge; label 14 bold tracked #B0AEA5 at 150 units; statement 68 serif ivory, 1.22 line height, up to three lines in 960 units (1360 without the tile); an ivory 10 unit button and a #30302E ghost button 52 high at 620.
- A 1 unit #30302E hairline at 758 and a footer row of three 14 #B0AEA5 labels; the optional field is 320 square at the right with its picture at 270.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `label` | text | 14 | sans | 我们的做法 |
| `statement` | text | 40 | serif | 好的策略不是一次回测里的漂亮曲线，而是任何人拿到同一份配置都能得到同一个结论。 |
| `cta_1` | text | 8 | sans | 阅读方法 |
| `cta_2` | text | 8 | sans | 查看配置 → |
| `foot_1` | text | 20 | sans | 研究 · 回测 · 实盘 |
| `foot_2` | text | 20 | sans | 示例站点 |
| `foot_3` | text | 20 | sans | 2026 年 11 月 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `field` | decoration | sage / blush / lilac / sky / sand | sand | the colour field behind the picture |
| `subject` | rhythm | 0-7 | 7 | which picture: 0 hand-graph, 1 seedling, 2 book, 3 magnifier, 4 spark-hands, 5 path, 6 candles, 7 compass |
| `show_tile` | decoration | true / false | true | draw the small colour field with a picture at the right |

## Decoration

- The ground, the hairline, the small field and its picture; the text slots are the only measured content.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
