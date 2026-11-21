# cover.index-hero

Hero: a serif title in two lines (the second at weight 300), a mono date label, a sans deck, two pill buttons and a seeded tile grid on the right.

Style: `index-explorer` (`styles/index-explorer/style.json`). The first screen of a data explorer or an index report; the grid is a decoration seeded by --param seed.

## Where it comes from

The data page's hero re-set: a two-line serif title over a mono date label with the page's tile-grid colours as the picture. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy and data are our own placeholders.

Samples: index-explorer/hero.

- Hero 80 / 88 serif, the second line weight 300; date label mono 13 uppercase #5E5D59; a small graph-paper mark with green dots above the title.
- Template: seeded grid, light and dark pass.

## Relations to keep

- Title 80 units serif, the second line weight 300, a 92 pitch (the page's 80 / 88); the mono label 14 uppercase-style with 4% tracking; deck 20 sans #5E5D59 in a 600-unit column.
- The grid is 8 x 8 cells of 70 on a 76 pitch, right-aligned to 1504, centred vertically; copy keeps to the left 880 units.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `title_1` | text | 8 | serif | 市场热点指数 |
| `title_2` | text | 9 | serif | 看资金在关注哪里 |
| `meta` | text | 36 | mono | UPDATED 2026-11-21 · SAMPLE DATA |
| `deck` | text | 40 | sans | 按地区与板块，看关注度比按成交占比的预期高出多少。示例数据，仅用于展示版式。 |
| `cta_1` | text | 6 | sans | 打开数据 |
| `cta_2` | text | 6 | sans | 怎么读 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground; tile names and the tooltip keep their fixed inks |
| `convention` | decoration | intl / cn | intl | intl (default, the measured lineage): green heat scale, rising green, falling coral; cn (红涨绿跌, Chinese markets): red heat scale from light to deep, rising red, falling green; the tile grid and the mark's dots follow it |
| `seed` | decoration | 1-9999 | 7 | seeds the tile values, so the grid's colours |

## Decoration

- The tile grid, the graph-paper mark with four dots and its hairlines are decoration.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
