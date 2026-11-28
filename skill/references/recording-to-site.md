# Recorded interface references

Use this guide when a web or ui replicate project uses a video reference. Rebuild every visible behavior as a real, inspectable control; a reference recording is evidence, not a runnable demo to ship.

## Record observed behaviors

After reviewing the video analysis, add this exact heading to `reference.md`:

```markdown
## Recorded behaviours

| id | time | change | control | keyboard |
| --- | --- | --- | --- | --- |
| rb-1 | 00:04 | Details panel opens | button "Details" | Tab, Enter |
```

Use unique ids matching `rb-<number>`. Describe the time, visible change, real control (role and element), and keyboard path. `keyboard: none: <reason>` is reserved for behavior the owner confirms has no user input, such as an ambient loop. The table is parsed again at delivery; keep it current after the owner confirms the extraction.

## Cover each behavior in the existing state matrix

Use the root `component-state-matrix.json` with the interaction-state-matrix schema. Add `recordedBehaviour: "rb-1"` to an entry that covers that behavior. Each listed id needs at least one entry that passes the existing interaction-state coverage checker. Unknown ids and ids without a passing entry block recording delivery. The workflow reads the current reference table and matrix at the existing delivery decision boundary; no ids are cached in workflow state.

Projects without a video reference are unaffected. An image reference stays out of scope even when it includes selected video-analysis frames.

## Build real controls

Implement the control shown in the recording using the project’s real interface and inputs. Do not ship a simulated cursor or autoplay a scripted interaction sequence. Recreate scroll reveals, pinned scrubs, menus, toggles, sliders, tabs, counters, and card flips as user-driven behavior. Use brief-derived content rather than copying words or branding from the recording. Honor reduced-motion preferences and verify keyboard behavior on phone and desktop layouts.
