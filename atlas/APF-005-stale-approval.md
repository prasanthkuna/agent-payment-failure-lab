# APF-005 — Stale approval at execute

| Field | Value |
|-------|--------|
| Profile | `APF-005` |
| Invariant | Execute only with fresh grant |
| Attack | Delay execute past grant validity |
| Expected | Execute rejected |
| Run | `npm run lab -- --profiles APF-005` |
