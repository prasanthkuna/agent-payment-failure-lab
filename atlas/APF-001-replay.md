# APF-001 — Replay / double authorization

| Field | Value |
|-------|--------|
| Profile | `APF-001` |
| Invariant | One valid payment → one authorization |
| Attack | Retry or replay the same payment intent |
| Expected | Second attempt denied or idempotent no-op |
| Run | `npm run lab -- --profiles APF-001` |
