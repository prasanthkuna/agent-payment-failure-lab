# APF-004 — Wrong transfer reconciliation

| Field | Value |
|-------|--------|
| Profile | `APF-004` |
| Invariant | On-chain transfer must match intent |
| Attack | Settle wrong amount or recipient |
| Expected | `RECONCILIATION_REQUIRED` |
| Run | `npm run lab -- --profiles APF-004` |
