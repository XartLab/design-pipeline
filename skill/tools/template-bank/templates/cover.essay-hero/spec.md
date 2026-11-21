# cover.essay-hero

Essay hero: a two-line serif title left with a sans deck, two pill buttons and a meta line, a large seeded pixel burst of clay rounded squares right.

Style: `institute-essay` (`styles/institute-essay/style.json`). The opening of a research essay, report or long-form explainer; the burst is the picture, so no art is needed. seed and density change the burst.

## Where it comes from

The reference pages' hero (serif title left, pixel burst right, two pill buttons) re-set on a 1600 x 900 canvas; sizes scaled from the measured 78 / 17 px. Borrow grammar, never assets: the two reference pages are private and nothing from them is shipped; all copy is our own placeholder.

Samples: institute-essay/hero.

- H1 78 px / 1.1 serif 400, deck 17 px sans #5E5D59, pill radius 99 with a 1 px hairline, burst of clay rounded squares to the right of the title.
- Template: the burst passes the 22% accent budget for 50 seeds and density 0.3-0.8.

## Relations to keep

- H1 76 units / 1.13 serif weight 400 in two lines left; deck 20 sans #5E5D59 under it; two pills 48 high with a 1 unit hairline and a 12 unit gap; meta 15 sans.
- The burst is a 15 x 15 grid in a 640-unit square, radius 7.5 cells, right of the title (centre x 1180); clay is the only colour and stays under 22% of the canvas for every seed.

## Slots

| Slot | Kind | Budget | Font role | Default (original placeholder copy) |
| --- | --- | --- | --- | --- |
| `brand` | text | 16 | sans | 示例研究所 · 研究笔记 |
| `title_1` | text | 14 | serif | 算力需求会走多远？ |
| `title_2` | text | 14 | serif | 三种情景下的推演 |
| `deck` | text | 50 | sans | 三种情景下的算力需求、供应链利润分配与估值含义。 |
| `cta_1` | text | 10 | sans | 直接看结论 ↓ |
| `cta_2` | text | 10 | sans | 三种情景 ↓ |
| `meta` | text | 32 | sans | 研究报告 · v1.0 · 2026 年 11 月 |

## Parameters

| Parameter | Class | Range | Default | Note |
| --- | --- | --- | --- | --- |
| `guides` | decoration | true / false | false | draw layout guides |
| `theme` | decoration | light / dark | light | light (ivory #FAF9F5) or dark (#141413) ground |
| `seed` | rhythm | 1-9999 | 7 | seed of the burst's noise |
| `density` | rhythm | 0.3-0.8 | 0.55 | share of the burst kept (higher is denser) |

## Decoration

- The burst's watercolour filter and the squares' opacity (0.78-1) are decoration.

Sizes: 1600x900, 1920x1080. A passing check is technical conformance only, not visual acceptance.
