# card.band-social

Social card 1200 x 630: ivory left with a tracked wordmark, a three-line serif headline, a sans line and an ink tag; a colour field with one picture on the right.

Style: `brand-band` (`styles/brand-band/style.json`). An og:image or a share card; subject and field choose the picture.

## Where it comes from

The measured hero statement and tile on a 1200 x 630 card: ivory half, a square-ish colour field half. Borrow grammar, never assets: the public reference pages are private and nothing from them is shipped; every picture is our own code-drawn illustration and all copy is our own placeholder.

Samples: brand-band/social.

- Statement serif 47.8 / 59.7 scaled to 58; tile #BCD1CA beside text.
- Template: 2400 x 1260 scales; every field passes.

## Relations to keep

- The left 640 units are ivory with a 64 inset: wordmark bold 18 tracked, headline serif 58 / 1.16 in up to three lines in 540 units, a 19 sans line, an ink tag 44 high; the right 560 units are a colour field with the picture at 400.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `brand` | text | 12 | sans | FIELDNOTE |
| `title` | text | 24 | serif | 策略的每一步都留下证据 |
| `sub` | text | 50 | sans | 研究、回测、实盘监控，一个工作台。 |
| `tag` | text | 8 | sans | 产品介绍 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `field` | decoration | sage / blush / lilac / sky / sand | blush | the colour field behind the picture |
| `subject` | rhythm | 0-7 | 6 | which picture: 0 hand-graph, 1 seedling, 2 book, 3 magnifier, 4 spark-hands, 5 path, 6 candles, 7 compass |

## Decoration

- The field and its picture with their line filter; the text slots are the only measured content.

Sizes: 1200x630, 2400x1260. A passing check is technical conformance only, not visual acceptance.
