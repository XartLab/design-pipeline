## Decisions

1. **The table lives in `reference.md`.** It is the observation record the owner already confirms at extract; the
   confirmation's hash binding then covers the behaviour list, and a later edit reopens the confirmation.
2. **Parse, do not interpret.** The extract step reads the table under the exact heading: columns `id`, `time`, `change`, `control`, `keyboard`. Ids match `rb-[0-9]+` and are unique. `control` and `keyboard` must be non-empty; `keyboard: none: <reason>` requires a non-empty reason, while owner confirmation establishes that the behaviour has no user input.
3. **Coverage takes the current table ids as input, and video projects always pass them at delivery.** `checkInteractionStateCoverage(matrix, { recordedBehaviours })` keeps its current result when the option is absent. A project supplies the existing `component-state-matrix.json`; every recorded id must be named by an entry that passes coverage, and an entry naming an unknown id is a blocker. One helper in `workflows/replicate.cjs`, `recordedBehaviours(root)`, parses the table at the point of use and returns `{ ids }` for a web or ui replicate project whose `reference.source.kind` is `video`, `{ error }` when its table is absent or invalid, and `null` otherwise. The helper never caches ids. The existing workflow decision boundary calls it before recording a web quick review acceptance or any web/ui delivery decision, so current table or matrix failures refuse the existing delivery action; it does not add a stage, gate, or receipt schema. Image references remain unaffected even if they have `videoAnalysis`.
4. **Simulated input is guidance, not a gate.** Detecting a fake cursor or an autoplayed demo mechanically is unreliable (ambient motion is legitimate); the reference states the rule and the page review checklist asks it.
## Risks

- Hand-written tables drift from the recording: the extract confirmation shows the table to the owner beside the
  analysis frames, and the owner confirms both.
