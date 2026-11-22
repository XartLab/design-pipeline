# Reference analyze-video path errors explain recovery

## Why

Closes #187. `reference analyze-video` rejects media and output paths outside the
project root, but the error only repeats the containment rule. Users need a
concrete recovery path, and the command help must state that both the video and
the output directory must stay inside the project root.

## What Changes

- Path-containment failures from `reference analyze-video` explain that the
  file should be copied under `<project-root>/.design-pipeline/` and that
  `--path` and `--output` must be project-root-relative paths.
- `reference analyze-video --help` states that `--path` and `--output` must
  both stay inside the project root and be project-root-relative.
- Other CLI containment failures name the same ignored `.design-pipeline/`
  staging directory before explaining how to widen `--root`.
## Capabilities

- `design-pipeline`: ADDED three requirements.

## Boundaries

Path acceptance and rejection semantics do not change. No new command, flag,
gate, receipt schema, or path policy is introduced.
