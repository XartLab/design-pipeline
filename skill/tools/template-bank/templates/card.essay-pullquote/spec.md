# card.essay-pullquote

Pull quote: a big serif quote about 2x body in a 1100-unit column under a large clay open-quote glyph, with a sans attribution.

Style: `institute-essay` (`styles/institute-essay/style.json`). One sentence that carries an essay; replace the attribution with the interview or the source.

## Where it comes from

The reference pages' pull quote re-set on a card. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: institute-essay/pullquote.

- Pull quote serif 36 / 45 px, about 946 px wide, with a large open-quote glyph in clay.
- Template: four lines at most; light and dark pass.

## Relations to keep

- Quote 54 units serif / 1.28 in a 1100-unit column (the page's 36 / 45 at 946 wide, scaled); the glyph is 220 units clay; the attribution is 18 sans #5E5D59, 62 units under the last line.
- The block is centred vertically; the clay glyph is decoration (2.96:1), never text.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `quote` | text | 120 | serif | 真正的问题不是支出会不会继续增长，而是推理成本下降的速度能不能跑赢需求。 |
| `attribution` | text | 40 | sans | — 示例引语，替换为访谈或原文 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground |

## Decoration

- The clay open-quote glyph.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
