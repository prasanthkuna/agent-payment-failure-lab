# APF-006 — On-chain policy hook

| Field | Value |
|-------|--------|
| Profile | `APF-006` |
| Invariant | ENFORCE mode blocks bypass |
| Attack | Direct transfer bypassing policy |
| Expected | Hook blocks or vault rejects |
| Run | `npm run lab -- --profiles APF-006` |
| Core | [railguard-protocol](https://github.com/prasanthkuna/railguard-protocol) contracts |
