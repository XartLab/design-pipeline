# Design

## Ownership

- `skill/scripts/cli-core.cjs` owns the public `reference analyze-video`
  command mapping, the containment-error repair text used by CLI commands, and
  the public help line.
- `skill/scripts/reference-video-core.cjs` and
  `skill/tools/art-motion/reference.cjs` keep their existing path-validation
  behavior and error scopes.

## Containment errors

The command seam catches containment failures from the plain and `--study`
analysis paths and rewrites their message with one canonical recovery
sentence. The repair text names `<project-root>/.design-pipeline/` and tells
the caller to pass project-root-relative `--path` and `--output` values.

CLI containment failures handled by `contained()` use the same staging
directory before the existing `--root` widening guidance. The failure code and
exit status remain unchanged.

## Help

The existing public help line for `reference analyze-video` states that
`--path` and `--output` must both stay inside the project root and must be
project-root-relative. No new help mechanism is added.

## Compatibility

Only error and help text changes. Existing accepted and rejected path sets,
exit codes, and downstream report shapes remain unchanged.
