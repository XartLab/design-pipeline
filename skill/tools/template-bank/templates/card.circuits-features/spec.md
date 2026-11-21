# card.circuits-features

Feature browser: a bordered panel with the feature id and name, monospace token strips highlighted in three oranges by activation, a ranked top-activations list with bars, an activation ramp legend and a numbered caption.

Style: `circuits-paper` (`styles/circuits-paper/style.json`). One feature in a paper's browser: dataset examples with their activating tokens and the ranked list of strongest activations; seed moves the peaks and rows (3-5) sets how many examples.

## Where it comes from

The reference attribution paper's feature visualisation (monospace tokens, orange highlights by activation) lifted into a panel with a ranked list. Borrow grammar, never assets: the reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: circuits-paper/features.

- Feature visualisation: monospace tokens in a bordered box, highlight oranges #FFAE72 #FF8D47 #FF6927 by activation, black text.
- Template: 3-5 rows x 50 seeds, light and dark pass.

## Relations to keep

- Panel 1408 x 650 units at (96, 96), radius 5; header 26-unit bold id and 22-unit name above a hairline; strips are 880 x 62 units in the beige with a stone outline, mono 24 units; a token highlight is a rect inset 7 units behind the token in hot_lo (below 0.66 of the peak), hot_mid or hot_hi, with black text.
- The top-activations list sits right of the strips: mono 20-unit token, a bar on a beige track and the derived value (two decimals) at the right edge; ranks fall by about 0.11.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `feat_id` | text | 10 | sans | 特征 #2417 |
| `feat_name` | text | 24 | sans | 利率下调之后的波动抬升 |
| `ex_label` | text | 10 | sans | 数据集示例 |
| `ex_{i}` | text | 26 | mono | 央行 宣布 下调 政策 利率 债市 走强 / 降息 预期 升温 带动 指数 反弹 / 政策 利率 维持 不变 市场 观望 / 下调 准备金率 释放 流动性 资金 宽松 / 利率 下行 空间 打开 估值 修复 |
| `top_label` | text | 10 | sans | 最强激活 |
| `top_{i}` | text | 8 | mono | 下调 / 降息 / 利率 / 宽松 / 下行 |
| `val_{i}` | text | 5 | sans | derived |
| `legend_lo` | text | 6 | sans | 弱激活 |
| `legend_hi` | text | 6 | sans | 强激活 |
| `cap_label` | text | 6 | sans | 图 3： |
| `caption` | text | 70 | sans | 特征 #2417 的数据集示例与最强激活词。示例数据：激活值由种子生成，不来自真实模型。 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (white #FFFFFF) or dark (#141414) ground |
| `seed` | rhythm | 1-9999 | 17 | seed of the activations |
| `rows` | proportion | 3-5 | 4 | number of dataset examples |

## Decoration

- Strip frames, highlights, bars and tracks are decoration for the text checks (the highlight is the text's ground and black text is 8:1 on every orange); tokens, values and labels are slots.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
