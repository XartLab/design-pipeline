# ui.devlog-article

Article page: hotkey nav, a left rail with title, TREE, an ASCII progress bar, read time and SHARE, and a reading column with a mono section head, prose and a list with bold lead terms.

Style: `devlog-terminal` (`styles/devlog-terminal/style.json`). One article of a developer blog at 1440 x 900. progress sets the bar and the percent, current the bold TREE item, tree_items how many TREE rows show.

## Where it comes from

The blog's article view at 1440 x 900: sticky rail with TREE and progress, 620-wide reading column. Borrow grammar, never assets: the reference blog was read privately and nothing from it is shipped; all copy is the case's own original text (benchlog), the pixel glyphs are drawn here and the mascot is an empty image slot.

Samples: benchlog/article.

- Reference: body sans 18 px / 1.6 #B0AEA5 in a 540-640 px column; section heads mono 15.75 px w500 uppercase; sub-sections mono not uppercase.
- Rail: title, TREE with branch corners and nesting (current item bold), ASCII progress bar with percent, read time, SHARE list.

## Relations to keep

- Rail 48-352 with a hairline at x 384; body column 602-1222 (620 wide, inside the measured 540-640).
- TREE rows 26 units apart, a branch corner before each, nesting 20 units; the current item is bold ink, the rest secondary grey.
- Progress bar of 20 blocks, filled blocks body grey, the rest dim; the percent follows the bar.
- Section head mono 15.75 uppercase; prose sans 18 / 1.6 body grey; list lead terms bold ink.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `mascot` | image | - | - |  |
| `nav_1` | text | 12 | mono | [H] HOME |
| `nav_2` | text | 12 | mono | [M] MODS |
| `nav_3` | text | 12 | mono | [D] DOCS |
| `nav_4` | text | 14 | mono | [T] TERMINAL |
| `cta` | text | 14 | monom | GET STARTED |
| `rail_title` | text | 64 | title | Teaching a test harness to explain its own failures |
| `tree_label` | text | 8 | mono | TREE |
| `tree_{i}` | text | 22 | mono | Overview / Pin the clock / Name the order / Reading a trace / Verdict lines / What broke / Next steps |
| `percent` | text | 4 | mono | 42% |
| `read_time` | text | 14 | mono | 10 MIN READ |
| `share_label` | text | 8 | mono | SHARE |
| `share_{i}` | text | 14 | mono | COPY LINK / POST / EMAIL |
| `sec_title` | text | 34 | monom | WHY FAILURES NEED A STORY |
| `para_1` | text | 300 | sans | A flaky test is rarely random. It is usually a promise the code never made: that two jobs finish in a fixed order, that a clock only moves forward, that a port is free. We stopped retrying failures and started asking what each one had assumed. |
| `item_lead_{i}` | text | 20 | sans | Pin the clock / Name the order / Log the seed |
| `item_rest_{i}` | text | 48 | sans | so every run starts at the same second. / when two steps must happen in sequence. / on the first line of the report. |
| `sub_title` | text | 30 | monom | Reading the trace |
| `para_2` | text | 260 | sans | Each trace now ends with a one-line verdict written for a person, not a parser. If the verdict is wrong, that is a bug we can reproduce, and the fix lands next to the test that found it. |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `progress` | proportion | 0-100 | 42 | reading progress in percent |
| `current` | decoration | 1-7 | 2 | current TREE item (bold, ink) |
| `tree_items` | rhythm | 3-7 | 7 | number of TREE rows |

## Decoration

- Hairlines, branch corners, progress blocks and list bullets: drawn.

Sizes: 1440x900, 2880x1800. A passing check is technical conformance only, not visual acceptance.
