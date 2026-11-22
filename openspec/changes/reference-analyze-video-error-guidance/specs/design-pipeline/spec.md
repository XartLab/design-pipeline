## ADDED Requirements

### Requirement: CLI path failures name a concrete recovery location

When a CLI command rejects a path because it is outside the command root, the
error SHALL name `<root>/.design-pipeline/` as a concrete recovery location and
SHALL explain how to pass the path relative to that root. The error code and
the accepted or rejected path set SHALL remain unchanged.

#### Scenario: A film command rejects an outside project root

- **WHEN** `film blocks --project-root <dir>` receives a project root outside `--root`
- **THEN** the error SHALL name `<root>/.design-pipeline/` and explain how to pass a path relative to `--root`

### Requirement: Reference video analysis explains contained input paths

`reference analyze-video` SHALL explain that a rejected `--path` or `--output`
must be copied under `<project-root>/.design-pipeline/` and passed as a
project-root-relative path. The command SHALL continue to reject paths outside
the project root with the existing contract error code.

#### Scenario: The reference video is outside the project root

- **WHEN** `reference analyze-video --path <outside-video> --output <new-dir>` runs
- **THEN** the error SHALL name `<project-root>/.design-pipeline/` and the project-root-relative repair

### Requirement: Reference video analysis help states its path constraints

The public help for `reference analyze-video` SHALL state that both `--path` and
`--output` must stay inside the project root and must be project-root-relative.

#### Scenario: A caller reads the command help

- **WHEN** `reference analyze-video --help` runs
- **THEN** the help line SHALL name both `--path` and `--output` and state both project-root constraints
