# card.essay-note-figure

Note figure: a graph-paper fan chart (dashed seeded lines in three hues) with a sticky note card riding on its left and a legend.

Style: `institute-essay` (`styles/institute-essay/style.json`). A figure with one explanation that rides beside it: the note says why the lines do what they do. seed, spread and lines change the fan.

## Where it comes from

A figure with a sticky note from the reference pages' figures, with a fan chart of seeded dashed lines. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: institute-essay/note-figure.

- Sticky note: paper #F5F4ED, 1 px hairline, radius 6, 340 px wide, bold sans title and serif text, riding on a figure's left.
- Template: the fan passes the static check for 50 seeds.

## Relations to keep

- The note is 360 units wide (the page's 340 at 1.06), paper #F5F4ED, 1 unit hairline, radius 6, 22 padding, bold sans title over serif text; it rides on the figure's left and ends before the plot starts (x 520).
- Fan lines: three bundles, dashed 7 on 4 at 50% opacity in purple, blue and amber; guides at 1x and the top tick; the top tick is derived from the data.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `fig_title` | text | 40 | sans | 三种情景下的算力需求路径，相对 2025 年 |
| `y_1` | text (derived) | 4 | sans | from the parameter |
| `y_2` | text (derived) | 4 | sans | from the parameter |
| `x_1` | text | 6 | sans | 2025 |
| `x_2` | text | 6 | sans | 2027 |
| `x_3` | text | 6 | sans | 2030 |
| `legend_1` | text | 6 | sans | 温和 |
| `legend_2` | text | 6 | sans | 中性 |
| `legend_3` | text | 6 | sans | 激进 |
| `note_title` | text | 14 | sans | 为什么线会散开 |
| `note_text` | text | 60 | serif | 早期需求主要由已签订单决定，几种情景差别不大；越往后，企业采用速度的不确定性越被放大。 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground |
| `seed` | rhythm | 1-9999 | 31 | seed of the fan |
| `spread` | rhythm | 0.15-0.8 | 0.45 | how far the lines of one bundle spread |
| `lines` | proportion | 6-24 | 14 | lines per bundle |

## Decoration

- Graph paper, the dashed fan lines and the guides are decoration.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
