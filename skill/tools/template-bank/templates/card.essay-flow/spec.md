# card.essay-flow

Flow card: a rounded paper band with 3-5 hand-drawn crayon-line icons (data stack, laptop, fork, page, person) joined by clay arrows, a sans label under each.

Style: `institute-essay` (`styles/institute-essay/style.json`). A process or pipeline in one line (sources to model to scenarios to report); labels are slots, count sets how many nodes, icon_start picks which icon the row begins with.

## Where it comes from

The kit page's flow figure (figure.flow) lifted into a parametric template: a paper band, line icons drawn as strokes through an SVG turbulence mask, clay arrows, labels as slots. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: institute-essay/flow.

- Kit figure: band 880 x 110 on a 920 viewBox, ink icons 3.2 stroke, clay arrows 2.4 stroke, labels sans 14 under the band (scaled 1.74x here).
- Template: 3, 4 and 5 nodes and every icon offset pass the static check; light and dark pass.

## Relations to keep

- Band 1360 x 240 units, full radius, paper with a 1 unit hairline, centred about y 420; nodes at equal steps along the band (count 3-5), icons 1.8x their local 84-unit box with 3.2-unit crayon-line strokes in ink.
- Arrows are clay, 4.4 units, a shaft and a two-stroke head, kept 18 units clear of both icons; labels are 24 units sans #5E5D59 centred under each node, 64 units below the band, never on the band.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `label_{i}` | text | 12 | sans | 数据源 / 模型 / 三种情景 / 研报 / 读者 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground |
| `count` | proportion | 3-5 | 5 | number of nodes in the flow |
| `icon_start` | rhythm | 0-4 | 0 | which icon the row starts with (stack, laptop, fork, page, person; the rest follow in that order) |

## Decoration

- The paper band, the icons and the clay arrows (strokes through the crayon line filter, which the static check never measures); the label text is the only measured content.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
