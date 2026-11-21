# card.index-tilemap

Tile map: a legend card at the left, a tile grid of 31 regions with one-character names on a four-step green scale, a focus outline and a pinned dark tooltip.

Style: `index-explorer` (`styles/index-explorer/style.json`). A region map for any index with four classes by rank. --param seed seeds the values, --param focus (0-30) picks the focus tile; the tooltip's name, class and numbers come from that tile.

## Where it comes from

The data page's map section re-set: legend card, tile grid, tooltip; the tile grid is a generic 31-unit table, not a map file. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy and data are our own placeholders.

Samples: index-explorer/tilemap.

- Tile 65 px on a 69 px pitch, radius 0, label sans 23 / 500; legend card white, 1 px #C9C4C4, radius 16; scale #BEE5D8 #89D1B9 #59B295 #388F76; tooltip #3D3D3A radius 8 pad 16 serif 16 name.
- Template: the tooltip sits in the empty corner so it never covers a tile name; every focus value 0-30 passes.

## Relations to keep

- Tiles 70 on a 74 pitch (the page's 65 on 69), 8 x 8 cells, a sans 30 / 500 name in fixed dark ink on every tile; four classes by rank (8, 8, 8, 7 tiles); the focus tile has a 2.5 ink outline.
- The legend card is 400 x 310, radius 16, white, a bold 17 title, a 15 description and four 14-unit dots; the map panel is #F5F4ED, radius 8.
- The tooltip is 4 x 2 cells in the grid's empty top-left corner (no name is covered): #3D3D3A, radius 8, a serif 20 name over a 1 rule, the class and two rows.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `title` | text | 8 | serif | 市场热点指数 |
| `lede` | text | 34 | sans | 各省份的关注度相对账户占比，高于 1 表示比预期更热。示例数据。 |
| `legend_title` | text | 8 | sans | 热点指数 |
| `legend_desc` | text | 36 | sans | 看某地区对板块的关注比按账户占比的预期高（大于 1）还是低（小于 1）。 |
| `legend_1` | text | 12 | sans | 领先（前 25%） |
| `legend_2` | text | 12 | sans | 中上（50–75%） |
| `legend_3` | text | 12 | sans | 中下（25–50%） |
| `legend_4` | text | 12 | sans | 起步（后 25%） |
| `hint` | text | 20 | sans | 指针悬停或点按省份查看明细 |
| `tip_name` | text (derived) | 6 | serif | from the parameter |
| `tip_class` | text (derived) | 12 | sans | from the parameter |
| `tip_l1` | text | 6 | sans | 热点指数 |
| `tip_v1` | text (derived) | 8 | sans | from the parameter |
| `tip_l2` | text | 6 | sans | 关注占比 |
| `tip_v2` | text (derived) | 8 | sans | from the parameter |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground; tile names and the tooltip keep their fixed inks |
| `seed` | decoration | 1-9999 | 11 | seeds the 31 index values |
| `focus` | decoration | 0-30 | 29 | the focus tile (0 = the top-right unit, counted row by row) |

## Decoration

- The panel, the card, the focus outline and the tooltip plate and rule are decoration; the tile names are real text.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
