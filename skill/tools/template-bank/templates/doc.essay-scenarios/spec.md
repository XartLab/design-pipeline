# doc.essay-scenarios

Scenario cards: a serif heading, a sans lede and three parallel paper cards, each with a swatch row, a bold sans title, a sans subtitle and one serif sentence.

Style: `institute-essay` (`styles/institute-essay/style.json`). Three parallel scenarios, options or cases; level_1..3 set how many of each card's three swatches are in the hue.

## Where it comes from

The reference pages' three parallel scenario cards set as a document page. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: institute-essay/scenarios.

- Three parallel scenario cards with a swatch row, a bold sans title, a sans subtitle and a serif sentence; italic credits with version and month.
- Template: every slot has a budget; light and dark pass.

## Relations to keep

- Three cards 440 x 350, 24 apart, paper #F5F4ED with a 1 unit hairline and radius 8; 28 padding.
- Swatches 24 units, 4 apart: the data hue for the first `level` of three, the neutral tile #D6D3C6 for the rest; hue per card: purple, blue, amber.
- Title 24 sans bold, subtitle 16 sans #5E5D59, sentence 19 serif / 1.5, up to five lines.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `heading` | text | 30 | serif | 可能的未来有很多，我们重点讨论三种 |
| `lede` | text | 60 | sans | 每个情景都用同一套参数生成，只改变推理需求增速和企业采用速度两项假设。 |
| `title_1` | text | 10 | sans | 温和情景 |
| `sub_1` | text | 18 | sans | 采用放缓，库存消化 |
| `text_1` | text | 70 | serif | 推理成本下降快于需求增长，2027 年起订单回落，利润向下游应用转移。 |
| `title_2` | text | 10 | sans | 中性情景 |
| `sub_2` | text | 18 | sans | 高位平台期 |
| `text_2` | text | 70 | serif | 训练投入趋稳，推理接棒，资本开支保持高位但同比增速降到个位数。 |
| `title_3` | text | 10 | sans | 激进情景 |
| `sub_3` | text | 18 | sans | 智能体大规模部署 |
| `text_3` | text | 70 | serif | 企业把大量流程交给智能体，推理需求每年翻倍以上，电力成为主要瓶颈。 |
| `credits` | text | 48 | serif | 撰写：研究组 · v1.0 · 2026 年 11 月 · 本页为模板示例，数据均为虚构 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground |
| `level_1` | proportion | 1-3 | 1 | swatches in the hue, card 1 |
| `level_2` | proportion | 1-3 | 2 | swatches in the hue, card 2 |
| `level_3` | proportion | 1-3 | 3 | swatches in the hue, card 3 |

## Decoration

- The swatches' watercolour filter.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
