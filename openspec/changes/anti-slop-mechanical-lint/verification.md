# 4.1 Verification — live lint run

Date: 2026-11-23. Linter: vendored Hallmark sloplint @ `4f6a46c6dc325d40ab268c93e25c7b96676ebccd`, run through `skill/scripts/evaluate-anti-slop.cjs`.

## Commands

```bash
# KATANAview — source tree (the checkout has no dist/; static tier reads .css/.tsx)
node skill/scripts/evaluate-anti-slop.cjs --root <workdir> \
  --rubric design-pipeline/skill/references/anti-slop-rubric.json --evidence <all-not-verified.json> \
  --lint KATANAview/src --output .design-pipeline/reviews/lint-katana.json --json
# → report written (status blocked: the all-not-verified evidence blocks every rule); 13 hard lint findings

# motion-recipe specimens
node skill/scripts/evaluate-anti-slop.cjs --root <workdir> \
  --rubric design-pipeline/skill/references/anti-slop-rubric.json --evidence <all-not-verified.json> \
  --lint design-pipeline/skill/tools/motion-recipes --output .design-pipeline/reviews/lint-motion-recipes.json --json
# → LINT_GATE_UNMAPPED: 38iii, 49 not in skill/references/anti-slop-lint-map.json
```

The specimens fail closed because the committed map has no `38iii`/`49`. For the manual review the raw sloplint run was used:

```bash
node skill/vendor/hallmark-sloplint/upstream/skills/hallmark/scripts/sloplint.mjs \
  design-pipeline/skill/tools/motion-recipes --json
```

The `<all-not-verified.json>` evidence marks every rubric rule `not-verified` so `--lint` reports findings without a `pass`-contradiction throw.

## KATANAview — 13 hard findings, manual review

| gate | rule | location | finding | verdict |
| --- | --- | --- | --- | --- |
| 27 | reduced-motion-path | `src/styles/analysis.css:604` | keyframe `kc-an-feed-new` animates background, no `prefers-reduced-motion` block | **real** — add a reduced-motion fallback |
| 33 | controls-are-real-and-operable | `src/ui/Lcd.test.tsx:25` | `<svg>` without aria-hidden/aria-label | **false positive** — unit-test fixture (`renderToStaticMarkup`), not shipped UI |
| 33 | controls-are-real-and-operable | `src/ui/Tooltip.test.tsx:18` | `<svg />` without aria-label | **false positive** — test-only; the wrapping `IconButton` carries `aria-label="设置"` |
| 34 | responsive-content-integrity | `src/styles/panel.css:1870` | `width: min(640px, calc(100vw - 24px))` on fixed centered `.kc-ib` | **false positive** — 24px margin exceeds the scrollbar width; no horizontal scroll |
| 34 | responsive-content-integrity | `src/styles/shell.css:1773` | `min(360px, calc(100vw - 2*space-4))` on `.kc-gate-panel` | **false positive** — centered; margin > scrollbar |
| 34 | responsive-content-integrity | `src/styles/symbol.css:39` | `min(1120px, calc(100vw - 24px))` on `.kc-ss` | **false positive** — fixed centered; 24px margin |
| 34 | responsive-content-integrity | `src/styles/trace.css:248` | `min(380px, calc(100vw - 16px))` on `.k-pop.kc-trace-pop` | **borderline** — 16px margin vs ~15px scrollbar; effectively fits |
| 39a | controls-are-real-and-operable | `src/styles/chat.css:485` | `.kc-chat-send:disabled { opacity: .3 }` | **real (minor)** — disabled by opacity alone; add fill/ink/cursor |
| 39a | controls-are-real-and-operable | `src/styles/replay-trading.css:534` | `.kc-trade-btn:disabled { opacity: .45 }` | **real (minor)** — same |
| 39a | controls-are-real-and-operable | `src/styles/symbol.css:560` | `.kc-venue-foot button:disabled { opacity: .5 }` | **real (minor)** — same |
| 39a | controls-are-real-and-operable | `src/styles/symbol.css:1772` | `.kc-section-reset:disabled { opacity: .4 }` | **real (minor)** — same |
| 56 | responsive-content-integrity | `src/styles/panel.css:3251` | two sticky `top:0` (`.kc-wl-head` + `.kc-alerts-head` + `.kc-custom-preview th`) | **false positive** — each is sticky inside its own table/scroll container; they do not overlap |
| 62 | content-available-without-motion | `src/styles/panel.css:1026` | `.kc-rail-expand` opacity:0 at rest | **false positive** — revealed by `:hover` / `:has(:focus-visible)` / `[aria-expanded]` in CSS; operable without script |

## Motion-recipe specimens — 7 hard findings, manual review

| gate | rule | location | finding | verdict |
| --- | --- | --- | --- | --- |
| 34 | responsive-content-integrity | `cooldown-completion.html:1`, `hp-ghost-bar.html:1`, `menu-switch.html:1`, `reward-arrival.html:1`, `full/gallery.css:1` | no `overflow-x: clip` on html/body | **false positive** — `main { inline-size: min(64rem, calc(100% - 2rem)) }` constrains width; no horizontal scroll |
| 40 | contrast-and-legibility | `reward-arrival.html:44` | `#coin` text `#fff6df` on `#a57218` ≈ 3.88:1 < 4.5:1, 12.8px bold | **real** — small text below 4.5:1 |
| 41 | contrast-and-legibility | `menu-switch.html:42` | `#menu-panel` dark bg sets no text colour | **false positive** — `:root { color: #edf3f8 }` (light); text inherits light |
| 41 | contrast-and-legibility | `menu-switch.html:46` | `#menu-panel button[aria-pressed=true]` dark bg, no text colour | **false positive** — inherits light from `:root` |
| 41 | contrast-and-legibility | `reward-arrival.html:28` | `.card` dark bg sets no text colour | **false positive** — `:root { color: #eef5f7 }` (light) |

## Unresolved

- The committed gate map (`skill/references/anti-slop-lint-map.json`) has no `38ii`, `38iii` or `49`, so the evaluator fails closed (`LINT_GATE_UNMAPPED`) on any page that triggers them — including the motion-recipe specimens (`38iii`, `49`). This is the designed fail-closed behavior; the lint cannot run to completion on those specimens until the map is completed. The map is not changed here: the change fixes it as reviewed.
- KATANAview was linted as source (`KATANAview/src`), not a built page: the checkout has no `dist/` and building the pnpm monorepo was not attempted. sloplint's static tier reads `.css`/`.tsx`, which covers the CSS and component source.