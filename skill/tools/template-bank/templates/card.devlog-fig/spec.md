# card.devlog-fig

Figure frame: a picture slot above a hairline caption box with a mono FIG label and a caption.

Style: `devlog-terminal` (`styles/devlog-terminal/style.json`). A figure in an article: a screenshot, diagram or chart in media with its FIG A label and caption. label_w sets the label cell, frame toggles the outer hairline.

## Where it comes from

The figure caption box of the article re-laid at 960 x 600. Borrow grammar, never assets: the reference blog was read privately and nothing from it is shipped; all copy is the case's own original text (benchlog), the pixel glyphs are drawn here and the mascot is an empty image slot.

Samples: benchlog/fig.

- Reference: a hairline-bordered row with a mono FIG label and a caption sans 15.75 px #87867F.

## Relations to keep

- Caption row 80 units high at the bottom under a hairline; the label sits in its own cell divided by a vertical hairline.
- Caption sans 15.75 secondary grey, at most two lines; the figure sits on the ground colour.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `media` | image | - | - |  |
| `label` | text | 8 | mono | FIG A |
| `caption` | text | 110 | sans | Failure rate per hundred runs before and after pinning the clock; the dashed line is the old retry budget. |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `label_w` | proportion | 104-144 | 120 | width of the FIG label cell, units at 960 |
| `frame` | decoration | true / false | true | hairline frame around the figure and caption |

## Decoration

- Hairline frame and rules: drawn.

Sizes: 960x600, 1920x1200. A passing check is technical conformance only, not visual acceptance.
