# Verification: ui acceptance binds the reviewed files

Implementation commit `c636a8150f61020041f4d0fc35441088257a1e05`, tested tree
`e320439f23c42dfcf42f7a0fd295b61b1df8250b` (parent `69869ce1`, the state of `origin/main` this
branch started from). This record was added after that tree was tested and changes no runtime bytes.

## Exercised behavior

- `decide --stage deliver` for ui requires repeatable `--file <path>` and records
  `decisions.deliveredFiles` (project-relative path -> sha256) plus `deliveryInputHashes =
  { files, extraction? }`. It refuses with `INPUT_MISSING` when no `--file` is given, when a named
  file does not exist, when a path resolves outside the project, and when a named path is a directory.
- After the owner accepts, a reviewed file changed, replaced or deleted returns `next` to the final
  review; its `first` names the changed paths ("The owner accepted an earlier version at ...; these
  reviewed files changed: index.html"). Unchanged files keep `next` at `done`, and a second acceptance
  of changed bytes returns to `done` with `diligence.current === true`.
- `reviewInputHashes(state, root)` hashes the listed files on every call, so the review binds bytes
  rather than the delivery sentence; `changedDeliveredFiles` reports the paths whose current hash
  differs from the recorded one. A ui delivery stays recorded while its files change, so `next`
  reopens the review instead of the work stage, while `deliveryCurrent` (the diligence statement's
  staleness note) still compares bytes.
- Replicate mode additionally binds the confirmed extraction (`deliveredExtraction`): editing
  `DESIGN.md` still reopens `extract`, and a delivery made against the previous extraction returns to
  `work` until it is recorded again.
- Film, edit and web acceptance bindings are untouched, as are web's `pageDigest`/interaction-gate
  binding and the film/edit `deliveredSha256` file check.

## Contract tests

`tests/workflow-ui-delivery-binding.test.cjs`, registered in `scripts/test-manifest.json`: changed
file reopens the review, unchanged files stay `done`, a deleted file reopens the review, every named
file is bound (not only the first), the recorded hashes have the documented shape, and the refusal
cases above.

Red-before proof: the same file on `origin/main` (`69869ce1`) fails 5 of its 6 tests — `next` still
returns `done` after the reviewed page is replaced or deleted; the sixth (unchanged files stay `done`)
passes on both trees. After the change all 6 pass.

## Repository checks

- `npm ci`: added 139 packages.
- `npm run specs:check`: 118 passed, 0 failed; `change/ui-review-binds-delivered-files` is valid.
- `npm run test:browser`: both workspace self-tests passed.
- `npm run package:skill -- --output-root dist`: `dist/design-pipeline-skill.tgz` (37,988,851 bytes),
  `dist/design-pipeline-skill.zip` (70,493,724 bytes) and `dist/checksums.txt` written.
- #182 reproduction on this tree (`ui/quick`, a project holding only `index.html`): deliver -> owner
  accept -> `next` returns `done`; replace `index.html` with a different page -> `next` returns the
  review naming `index.html`; accept again -> `done` with `diligence.current` true.
- `node scripts/qa.cjs`: repository tests 2297 passed, 15 failed of 2322; packaging, installed-package
  and status checks all passed, so the run exits 1 on those 15. None of them is in the ui workflow:

| Failing test file | Cause observed |
| --- | --- |
| `design-direction-library`, `film-sources`, `install-doctor`, `ui-craft-sources` (2) | `tar: Option --force-local is not supported` — Windows `bsdtar` ahead of GNU tar on PATH |
| `tunables-panel` | `ECONNRESET` in the local preview server test |
| `browser-practice-lint` | pre-existing finding `skill/tools/template-bank/vector80.cjs:203 fixed-wait` |
| `atomic-age-kit`, `browser-locate`, `measured-spec-drift` (2), `page-refs` (2), `template-distill`, `template-style-pack` | Chrome rendering/profile-contention and font-substitution assertions |

The first seven were re-run on `origin/main` (`69869ce1`) and fail there identically; the remaining
eight are browser/rendering assertions, and none of those six test files requires `workflow-core.cjs`,
`workflows/shared.cjs` or `cli-core.cjs`.

## Acceptance boundary

This evidence covers the exercised workflow state machine and its contract tests. Component
Conformance and owner Visual Acceptance remain separate, and the appearance ledger written on delivery
and acceptance is still not a visual acceptance.