# doc.circuits-contents

Contents and article: a sticky table of contents (top-level items 600, nested 400, the section in view marked) beside the article column with a kicker, heading, paragraph and a footnote preview card.

Style: `circuits-paper` (`styles/circuits-paper/style.json`). The reading chrome of a long paper: the section list that follows the reader and one section of text with its footnote card; count (5-8) sets the items and active the marked section.

## Where it comes from

The reference papers' sticky contents block and footnote hover card, set beside one article section. Borrow grammar, never assets: the reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: circuits-paper/contents.

- Contents: 516 px block, 1 px right rule, items 13 / 19.5 px, top-level 600, nested 400; hover card pale with small text and blue citation numbers.
- Template: 5-8 items x every active item, light and dark pass.

## Relations to keep

- Contents at x 96: a 28-unit bold heading, items every 44 units in 18 units (top-level 600 in the 80% ink, nested items 400 in the 60% ink and indented 22), the marked item in black with a 3-unit maroon bar to its left; a 1 unit rule on the block's right edge at x 516.
- Article column at x 640, 780 units: a 16-unit tracked kicker, a 44-unit 600 heading, a 20-unit paragraph at 1.7 line height; the footnote card is 746 x 168 units in the beige with a hairline and radius 6, a bold 16-unit blue label over 17-unit text in the 60% ink.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `toc_title` | text | 4 | sans | 目录 |
| `toc_{i}` | text | 14 | sans | 摘要 / 1 引言 / 2 模型与方法 / 稀疏特征 / 归因图 / 3 特征浏览器 / 4 结果与局限 / 参考文献 |
| `kicker` | text | 10 | sans | 第 2 节 |
| `heading` | text | 16 | sans | 模型与方法 |
| `para` | text | 150 | sans | 我们训练一个两层的小型 Transformer，输入是一段离散化的价格序列。为了读出它在算什么，我们在中间层的激活上训练一个稀疏自编码器，把激活拆成少数几个同时亮起的特征。 |
| `fn_label` | text | 10 | sans | 脚注 3 |
| `fn_text` | text | 90 | sans | 特征数取 4096，稀疏系数在示例中取 0.8。以上均为演示用的设定，不对应真实训练。 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (white #FFFFFF) or dark (#141414) ground |
| `count` | proportion | 5-8 | 8 | table of contents items |
| `active` | rhythm | 0-7 | 3 | the item marked as in view |

## Decoration

- The active bar and the rule are decoration; every line of text is a slot.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
