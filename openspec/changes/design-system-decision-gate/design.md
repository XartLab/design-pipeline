# Design

## Where the gate lives

`advanceChange` in `skill/scripts/pipeline-state-core.cjs` is the only place where a change moves
between the v2 phases named `directions`, `design-spec`, `motion-spec`, `tasks` and `implementation`.
It already enforces the transition table and writes the event chain, so the gate is one precondition
there, not a second gate.

```
change advance --phase directions --design-system-decision design-system-decision.json
  -> cli-core reads the file inside the change root, hashes it
  -> advanceChange validates the receipt, binds {path, sha256, mode} into state.extensions.designSystem
  -> every later mutation re-reads the file and compares its hash
```

## The receipt

The v1 receipt keeps its schema id and its ten original fields. Three fields are added in place:

- `changeId` - the change the decision governs; a receipt from another change is refused.
- `authorization` - `{by: "owner" | "agent", scratch: boolean, delegation}`; an owner-authorized
  claim carries the owner's quoted instruction or the delegating workflow state's hash.
- `compared` - one record per catalog entry the decision evaluated, computed by `decideDesignSystem`
  rather than asserted by the caller.

`compared` is computed, so an agent cannot claim it did not compare anything.

## What makes a receipt consumable

| situation | consumable |
| --- | --- |
| owner scratch choice (owner's words recorded) | yes, without catalog, inventory or search |
| reference / adopt / substitute | yes, with searched capabilities and compared candidates |
| agent-made `custom` | only with searched capabilities and compared candidates |
| zero-result product query with capability hits | only when the receipt marks it inconclusive |
| no searched capabilities, no compared candidates, no authorization | no |

A `reference` receipt is consumable but names no runtime substrate, and the result reports the
catalog capabilities the search found and the decision did not take.

## Lineage

The binding records the receipt's path and hash, like the design and motion foundations do. The hash
is compared on every later mutation of the change, so an edited or removed receipt invalidates the
advancement instead of preserving stale approval. A gate refusal throws with code `BLOCKED`, so the
CLI exits 2 (gate failed) and keeps the machine reason in `details.findingCode`.
