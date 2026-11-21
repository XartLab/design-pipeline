# banner.devlog-dotfield

Dot-matrix field: grey dots of four sizes forming faint soft shapes around a clear disc with a mascot slot in the middle.

Style: `devlog-terminal` (`styles/devlog-terminal/style.json`). The closing band of a page or a footer backdrop. seed changes the shapes (same seed, same field), density how much of the grid is filled. The mascot slot is yours.

## Where it comes from

The closing dot-matrix field of the blog re-built from soft blobs at 1440 x 480. Borrow grammar, never assets: the reference blog was read privately and nothing from it is shipped; all copy is the case's own original text (benchlog), the pixel glyphs are drawn here and the mascot is an empty image slot.

Samples: benchlog/dotfield.

- Reference: grey dots of varying size forming faint shapes with a mascot in the middle; here the shapes are seeded blobs.

## Relations to keep

- 24-unit dot grid, four dot radii (1.2-3.75 units); the two larger classes are lighter grey.
- A clear disc of 118 units around the canvas centre holds the mascot slot; the bottom corners stay clear for the label and the hint.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `mascot` | image | - | - |  |
| `field_label` | text | 12 | mono | FIELD 007 |
| `hint` | text | 30 | mono | PRESS ANY KEY TO CONTINUE |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `seed` | rhythm | 1-999 | 7 | seed of the soft shapes |
| `density` | proportion | 0.35-0.75 | 0.55 | how much of the dot grid is filled |

## Decoration

- The whole dot field: drawn, deterministic for a seed.

Sizes: 1440x480, 2880x960. A passing check is technical conformance only, not visual acceptance.
