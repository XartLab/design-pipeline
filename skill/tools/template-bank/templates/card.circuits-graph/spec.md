# card.circuits-graph

Attribution graph: layered nodes over a token row with weighted mauve edges (the strongest in maroon), layer labels, token tiles, an output tile and a two-entry legend with a numbered caption.

Style: `circuits-paper` (`styles/circuits-paper/style.json`). The path from input tokens to an output through active features: layers (2-4) and cols (3-5) set the grid, seed the active nodes and edge weights.

## Where it comes from

The reference attribution-graph figure's grammar (beige and maroon nodes in layers over a token row, weighted mauve edges, a legend with a diamond and a line sample) drawn from a seed. Borrow grammar, never assets: the reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: circuits-paper/graph.

- Attribution graph: circles filled #F6F6F3 with a 2 px #B8B6AD outline, active #633636, edges #C46686 0.5-3 px, token tiles #E6E3D6 with mono 17 px, error nodes as diamonds.
- Template: 2-4 layers x 3-5 columns x 50 seeds, light and dark pass.

## Relations to keep

- Graph area x 192-1056, y 168-656: layer rows evenly spaced bottom up, four 11-unit-radius nodes per token and layer at 36-unit steps, beige with a 2-unit stone outline when inactive and maroon when active; edges are vertical cubic curves between active nodes (width 1.2 + 3.4 x weight, opacity by weight), thin stone edges run from the tokens to the first layer, the output tile sits top right.
- Legend at x 1180, 324 units wide: a maroon diamond with a bold title and up to four 16-unit lines, then a mauve line sample with its title and text; the caption sits at y 758.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `fig_title` | text | 24 | sans | 归因图：从输入词到输出的激活路径 |
| `layer_{i}` | text | 6 | sans | 第 1 层 / 第 2 层 / 第 3 层 / 第 4 层 |
| `tok_{i}` | text | 6 | mono | 利率 / 下调 / 之后 / 波动 / 加剧 |
| `output` | text | 4 | mono | 上升 |
| `legend_title_1` | text | 10 | sans | 重建误差 |
| `legend_text_1` | text | 44 | sans | 特征没能解释的部分用菱形节点补回，使替代模型的输出和原模型一致。 |
| `legend_title_2` | text | 10 | sans | 归因边 |
| `legend_text_2` | text | 44 | sans | 线越粗，上游特征对下游的因果贡献越大，最粗的边用深色标出。 |
| `cap_label` | text | 6 | sans | 图 4： |
| `caption` | text | 70 | sans | 对输入“利率 下调 之后 波动”追踪出的归因图（示意）。节点是特征，边是因果贡献；示例数据。 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (white #FFFFFF) or dark (#141414) ground |
| `seed` | rhythm | 1-9999 | 11 | seed of the active nodes and weights |
| `layers` | proportion | 2-4 | 3 | feature layers |
| `cols` | proportion | 3-5 | 4 | token positions |

## Decoration

- Nodes, edges and tiles are decoration (the shapes are plain geometry the static check measures for the accent budget); layer labels, tokens, output, legend and caption are slots.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
