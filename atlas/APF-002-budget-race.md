# APF-002 — Budget race

| Field | Value |
|-------|--------|
| Profile | `APF-002` |
| Invariant | Shared budget — only one concurrent winner |
| Attack | Parallel spends against one budget |
| Expected | At most one authorization succeeds |
| Run | `npm run lab -- --profiles APF-002` |
