# banner.band-cta-row

CTA row on an oat band: a centred serif heading, a lede, a row of four nav pills, an ink button and a ghost button, a note.

Style: `brand-band` (`styles/brand-band/style.json`). The call to action that closes a page, above the footer; pills are filters or entry points.

## Where it comes from

The measured nav pills (13 px, 8 x 16, radius full, #F5F4ED, 1 px #E8E6DC), the ink 17 px button (12 x 24, radius 10) and the flat #E8E6DC button, set on the oat #F0EEE6 band. Borrow grammar, never assets: the public reference pages are private and nothing from them is shipped; every picture is our own code-drawn illustration and all copy is our own placeholder.

Samples: brand-band/cta-row.

- Pills 28 high, buttons 36 high at 1x, scaled 1.2-1.4.
- Template: four pills, two buttons and the note centre and fit.

## Relations to keep

- An oat #F0EEE6 ground; the heading serif 52 centred at 150, the lede 19 at 206, a centred row of 34-unit nav pills at 262 with 8 gaps, an ink button and a flat grey one 52 high at 350 and a 14 note at 470.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `heading` | text | 20 | serif | 从一份配置开始 |
| `lede` | text | 44 | sans | 读文档、跑一次示例回测，或者直接打开监控面板。 |
| `pill_1` | text | 6 | sans | 研究 |
| `pill_2` | text | 6 | sans | 回测 |
| `pill_3` | text | 6 | sans | 实盘 |
| `pill_4` | text | 6 | sans | 文档 |
| `cta_1` | text | 8 | sans | 开始使用 |
| `cta_2` | text | 8 | sans | 查看方法 → |
| `note` | text | 40 | sans | 示例站点，文案为占位。 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |

## Decoration

- The oat ground; the text slots are the only measured content.

Sizes: 1600x600, 1920x720. A passing check is technical conformance only, not visual acceptance.
