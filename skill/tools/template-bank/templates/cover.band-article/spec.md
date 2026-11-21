# cover.band-article

Article cover: a full-height square colour field with one picture beside a column with category, date, a bold title, a serif deck and a byline.

Style: `brand-band` (`styles/brand-band/style.json`). A news or essay cover; subject and field choose the picture.

## Where it comes from

The measured news article (bold sans title 35.9 / 40.9, serif body, a figure with radius 4) and the careers H1 (bold 60.7 / 65.6) re-set as a cover: a field square for the figure, the title scaled to 54. Borrow grammar, never assets: the public reference pages are private and nothing from them is shipped; every picture is our own code-drawn illustration and all copy is our own placeholder.

Samples: brand-band/article.

- Article H1 sans 700 35.9 / 40.9, body serif 17 / 26 in 720, lede serif 28 / 36; careers H1 sans 700 60.7 / 65.6, lede serif 22 / 31.9.
- Template: three title lines of 10 characters fit; every subject passes.

## Relations to keep

- A 900 x 900 colour field at the left edge with the picture at 62% (about 560 units); the column starts at 980 and is 540 wide.
- Category bold 14 with a date 14 regular after it; title bold sans 54 / 1.18 in up to three lines; deck serif 22 / 1.5 #3D3D3A in up to three lines; a hairline at 738 and the byline 15 #5E5D59 below.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `category` | text | 8 | sans | 方法 |
| `date` | text | 18 | sans | 2026 年 11 月 21 日 |
| `title` | text | 28 | sans | 回测不是证明，是一份可以被复查的记录 |
| `deck` | text | 60 | serif | 我们把一次回测需要的数据口径、参数和随机种子放在同一份配置里，让别人能复现，也能反驳。 |
| `byline` | text | 30 | sans | 研究组 · 示例文章，文案为占位 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `field` | decoration | sage / blush / lilac / sky / sand | lilac | the colour field behind the picture |
| `subject` | rhythm | 0-7 | 2 | which picture: 0 hand-graph, 1 seedling, 2 book, 3 magnifier, 4 spark-hands, 5 path, 6 candles, 7 compass |

## Decoration

- The field and its picture with their line filter, the hairline; the text slots are the only measured content.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
