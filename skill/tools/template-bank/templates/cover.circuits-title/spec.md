# cover.circuits-title

Paper title and byline: a bold sans title, a deck, a byline grid (authors left, affiliation and date stacked right) between two hairlines, a marker line and the abstract.

Style: `circuits-paper` (`styles/circuits-paper/style.json`). The first screen of a research paper: title, who wrote it, where, when, and the abstract that opens the article. Authors take markers (* and a dagger) explained in the note line.

## Where it comes from

The reference papers' title block and byline container, re-set at card size with our own copy: a bold sans title, a hairline-bounded grid and the abstract opening the article. Borrow grammar, never assets: the reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: circuits-paper/title.

- Byline: full-width band between two 10% black rules, kickers 9.6 px uppercase 50% ink, names 12.8 / 19.2 px, authors 570 px at the left, affiliation and date stacked 70 px apart in a 114 px column (scaled about 1.5x here).
- Template: default and 50 seeds, both sizes, light and dark pass the static check.

## Relations to keep

- Title 66 units bold 700 black on two lines at x 96; deck 22 units in the 60% ink; the byline sits between two hairlines (y 430 and 662): authors 19 units in the 80% ink over three lines at the left, affiliation and date stacked in a 388-unit column at x 1116, each under a 13-unit tracked kicker in the 60% ink; the marker line is 15 units.
- The abstract opens under the byline: a bold 17-unit lead-in at x 96 and 20-unit text at 1.7 line height starting at x 192.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `brand` | text | 16 | sans | 示例研究线索 · 可解释性 |
| `title_1` | text | 14 | sans | 价格序列小模型里的特征 |
| `title_2` | text | 14 | sans | 一份可解释性研究笔记 |
| `deck` | text | 40 | sans | 一个两层 Transformer 的特征、归因图与稀疏性（示例） |
| `k_authors` | text | 4 | sans | 作者 |
| `k_affil` | text | 4 | sans | 机构 |
| `k_pub` | text | 4 | sans | 发布 |
| `authors` | text | 90 | sans | 示例作者甲*†、示例作者乙*、示例作者丙†、示例作者丁、示例作者戊、示例作者己、示例作者庚、示例作者辛、示例作者壬、示例作者癸、示例作者子*、示例作者丑 |
| `affiliation` | text | 20 | sans | 示例研究组 · 量化可解释性 |
| `published` | text | 16 | sans | 2026 年 11 月 21 日 |
| `note` | text | 46 | sans | * 核心贡献者　† 基础设施贡献者　数据与结论均为示例 |
| `abstract_label` | text | 4 | sans | 摘要 |
| `abstract` | text | 120 | sans | 我们在一个合成的价格序列任务上训练两层小型 Transformer，用稀疏自编码器取出特征，再对一条输入追踪归因图。本页的数据全部是示例，用来演示论文版式与交互图，不构成真实实验结果。 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (white #FFFFFF) or dark (#141414) ground |

## Decoration

- The brand mark (three nodes and two edges), the hairlines and the margin guides are decoration; all text is slots.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
