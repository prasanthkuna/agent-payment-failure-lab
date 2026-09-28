# Railguard Failure Atlas

**Single source of truth** for failure taxonomy (plan28.1). Protocol and website **link here**; they do not fork Atlas content.

## Structure (target)

```text
atlas/
  APF-001-replay.md
  APF-002-budget-race.md
  ...
profiles/   # executable runners (packages/core)
fixtures/
```

## Profiles today

Executable IDs **APF-001 … APF-006** — see root [README](../README.md).

Each Atlas entry should document:

- Failure (human wording)
- Invariant violated
- Attack scenario
- Expected protection
- Executable profile ID
- Evidence paths
- References

Contributions: add markdown under `atlas/` and wire the profile in `packages/core`.
