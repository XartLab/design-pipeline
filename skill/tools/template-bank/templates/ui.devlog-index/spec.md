# ui.devlog-index

Post index: hotkey nav, brand column, filter tabs, a featured row with a clay pixel tile and 6-8 hairline rows with icon, date, title and read time.

Style: `devlog-terminal` (`styles/devlog-terminal/style.json`). The front page of a developer blog or changelog: the list of posts. rows sets how many rows show (6-8); each row's date, title and read time are slots. The mascot slot stays empty or holds your own art.

## Where it comes from

The blog's front page re-laid at 1440 x 900: hotkey nav, brand column, tabs, featured row, hairline rows, LOAD MORE with its hint. Borrow grammar, never assets: the reference blog was read privately and nothing from it is shipped; all copy is the case's own original text (benchlog), the pixel glyphs are drawn here and the mascot is an empty image slot.

Samples: benchlog/index.

- Reference: site name mono 31.5 px w400; tabs small mono caps, active ink; rows 24 px icon, mono date, sans title, read time right; featured tile large.
- Palette read from computed styles: ground #141413, ink #FAF9F5, secondary #87867F, clay #D97757 on tiles only.

## Relations to keep

- Nav 72 units high, hairline under it; brand column 48-392, hairline at x 392; main column 424-1392.
- Rows 46 units apart from y 386, a hairline under each; icon tile 28 units, date at x 476, title at x 588, read time right-aligned at 1392.
- Clay only on the featured tile (192) and the row tiles (28); the button is ink on ground with square corners.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `mascot` | image | - | - |  |
| `nav_1` | text | 12 | mono | [H] HOME |
| `nav_2` | text | 12 | mono | [M] MODS |
| `nav_3` | text | 12 | mono | [D] DOCS |
| `nav_4` | text | 14 | mono | [T] TERMINAL |
| `cta` | text | 14 | monom | GET STARTED |
| `brand` | text | 14 | mono | benchlog |
| `tagline` | text | 40 | sans | Notes on building and shipping. |
| `tab_{i}` | text | 14 | mono | ALL / ENGINEERING / RESEARCH / PRODUCT / NOTES |
| `search` | text | 14 | mono | [S] SEARCH |
| `feature_tag` | text | 10 | monom | FEATURED |
| `feature_cat` | text | 16 | mono | ENGINEERING |
| `feature_title` | text | 64 | title | Teaching a test harness to explain its own failures |
| `feature_author` | text | 28 | mono | BY INES CALDER |
| `row_date_{i}` | text | 10 | mono | 2026.11.18 / 2026.11.14 / 2026.11.09 / 2026.11.03 / 2026.10.28 / 2026.10.21 / 2026.10.15 / 2026.10.07 |
| `row_title_{i}` | text | 56 | sans | Why our flaky tests were really a scheduling bug / A field guide to reading a core dump at 3 a.m. / Shrinking a monorepo build from forty minutes to six / What a type checker taught us about our API / Notes on retries, backoff and the thundering herd / Designing a log format people actually grep / Rolling back a schema change without downtime / The case for boring queues |
| `row_time_{i}` | text | 12 | mono | 8 MIN READ / 12 MIN READ / 9 MIN READ / 6 MIN READ / 11 MIN READ / 5 MIN READ / 10 MIN READ / 4 MIN READ |
| `load_more` | text | 12 | mono | LOAD MORE |
| `hint` | text | 28 | mono | Press R to load more |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `rows` | rhythm | 6-8 | 7 | number of post rows |
| `active` | decoration | 1-5 | 1 | active filter tab |
| `current` | decoration | 1-4 | 1 | current hotkey in the nav |
| `glyph` | decoration | bug / check / flask / chart / prompt / bolt | flask | pixel glyph of the featured tile |
| `glyph_offset` | decoration | 0-5 | 0 | where the row icons start in the glyph list |

## Decoration

- Hairlines, the mascot placeholder, LOAD MORE outline and pixel glyphs: drawn.

Sizes: 1440x900, 2880x1800. A passing check is technical conformance only, not visual acceptance.
