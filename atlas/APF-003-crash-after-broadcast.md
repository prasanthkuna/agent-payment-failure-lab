# APF-003 — Crash after broadcast

| Field | Value |
|-------|--------|
| Profile | `APF-003` |
| Invariant | Reservation must not stay frozen after crash |
| Attack | Crash after broadcast, retry |
| Expected | Reconcile or release reservation |
| Run | `npm run lab -- --profiles APF-003` |
| Postmortem | [docs/POSTMORTEM-APF-003.md](../docs/POSTMORTEM-APF-003.md) |
