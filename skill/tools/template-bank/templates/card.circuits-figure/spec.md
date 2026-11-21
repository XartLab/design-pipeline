# card.circuits-figure

Figure with a margin note: a bordered panel with a residual-stream schematic (blocks reading and writing through mauve arrows), token tiles, a numbered caption and a margin note with a thumbnail in the right gutter.

Style: `circuits-paper` (`styles/circuits-paper/style.json`). A schematic figure with its numbered caption and the aside that rides in the gutter; layers (1-3) sets how many blocks per stream and tokens (3-5) how many streams.

## Where it comes from

A bordered figure panel, a numbered caption with a bold lead-in and a gutter note with a thumbnail, with a residual-stream schematic drawn from parameters. Borrow grammar, never assets: the reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: circuits-paper/figure.

- Figure: the 2021 paper's gutter thumbnail beside the text and the 13 px numbered captions; the schematic is our own.
- Template: 1-3 layers x 3-5 tokens, 50 seeds, light and dark pass.

## Relations to keep

- Panel 1004 x 560 units at (96, 120), white, 1 unit hairline in the rule grey, radius 5; the title is 17 units bold centred; streams are 10-unit tile bars at equal steps with beige blocks (stone 2-unit outline) reading and writing through mauve arrows; token tiles are 46 units tall in the tile beige with mono 20-unit text.
- Caption: bold 17-unit lead-in, then the sentence in the 80% ink under the panel; the margin gutter starts at x 1180, 324 units wide: a 60 x 76 thumbnail, a bold 16-unit title, 17-unit text in the 60% ink over up to five lines.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `fig_title` | text | 30 | sans | 残差流：每一层读入、写回 |
| `stream_label` | text | 10 | sans | 残差流 |
| `tok_{i}` | text | 6 | mono | 开盘 / 放量 / 下跌 / 回升 / 收盘 |
| `block_{i}` | text | 4 | sans | 注意力 / 前馈 / 注意力 |
| `cap_label` | text | 6 | sans | 图 2： |
| `caption` | text | 70 | sans | 每个位置有一条残差流；每层的注意力与前馈块从流里读入，把结果加回。示意图，非真实模型。 |
| `margin_label` | text | 14 | sans | 读入与写回 |
| `margin_text` | text | 80 | sans | 因为每层都只是把输出加回残差流，层与层之间可以直接通信；后面的层读到的是前面所有层写入之和。 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (white #FFFFFF) or dark (#141414) ground |
| `layers` | proportion | 1-3 | 2 | blocks per residual stream |
| `tokens` | proportion | 3-5 | 4 | number of token streams |

## Decoration

- Streams, blocks, arrows and the thumbnail are decoration; token text, captions and notes are slots.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
