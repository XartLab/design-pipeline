# card.essay-finding

Finding card: a faint serif 'Finding N: topic' above a one-sentence claim, three crayon bars on graph paper with derived values, a legend, an asterisk footnote and a bold italic 'How to read this' line.

Style: `institute-essay` (`styles/institute-essay/style.json`). A research finding with three scenarios or categories. value_1..3 and max are parameters: the value text and the bar come from the same number.

## Where it comes from

A finding block and its full-width figure from the reference pages, set as one card; bars taken from the measured figure style (rounded 3, crayon-textured). Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: institute-essay/finding.

- 'Finding N: topic' faint serif about 28 px above a one-sentence claim in ink serif about 28 px; figure on 22 px graph paper with a bold italic 'How to read this:' caption.
- Template: value and bar share one parameter; checked at both sizes, light and dark.

## Relations to keep

- 'Finding N' 30 units faint serif (large type: 3.5:1); claim 36 serif ink; the figure on graph paper starts 100 units under the claim.
- Bars 34 high on a 76 pitch, a 880-unit track from x 400; values to the right of the track, labels to the left, never text on a bar.
- Legend squares 14 units, footnote 14 sans centred, the how-to-read line in a 640-unit column (lead-in bold italic, 10 units before its sentence).

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `finding_label` | text | 24 | serif | 发现 1：资本开支规模 |
| `claim` | text | 40 | serif | 每个情景下支出都会增长，但幅度相差一个数量级 |
| `fig_title` | text | 40 | sans | 2028 年全球 AI 资本开支，相对 2025 年的变化* |
| `label_1` | text | 8 | serif | 温和情景 |
| `label_2` | text | 8 | serif | 中性情景 |
| `label_3` | text | 8 | serif | 激进情景 |
| `value_1` | text (derived) | 8 | sans | from the parameter |
| `value_2` | text (derived) | 8 | sans | from the parameter |
| `value_3` | text (derived) | 8 | sans | from the parameter |
| `legend_1` | text | 6 | sans | 温和 |
| `legend_2` | text | 6 | sans | 中性 |
| `legend_3` | text | 6 | sans | 激进 |
| `footnote` | text | 48 | sans | *按 2025 年美元计价 · 示例数据，仅用于展示模板 |
| `howto_label` | text | 12 | sans | 怎么读这张图： |
| `howto` | text | 34 | sans | 每根条的长度是相对 2025 年的增幅，右侧是增幅百分比。 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground |
| `value_1` | proportion | 0-300 | 12 | first bar, percent |
| `value_2` | proportion | 0-300 | 41 | second bar, percent |
| `value_3` | proportion | 0-300 | 118 | third bar, percent |
| `max` | proportion | 20-300 | 130 | the value at the end of the track |

## Decoration

- Graph paper (22 units, 1 unit lines), the crayon filter, the neutral track tiles and the baseline are decoration.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
