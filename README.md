# Railguard Failure Lab

[![CI](https://github.com/prasanthkuna/agent-payment-failure-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/prasanthkuna/agent-payment-failure-lab/actions/workflows/ci.yml)

Executable adversarial tests for autonomous stablecoin payments. Owns the **[Failure Atlas](./atlas/README.md)** taxonomy (APF-001…).

```bash
railguard attack   # from railguard-gateway repo, or:
npm run lab
```

> **Use in CI:** `uses: prasanthkuna/agent-payment-failure-lab@v0.1.0` — see [docs/INTEGRATION.md](./docs/INTEGRATION.md)

## Profiles

| ID | Invariant | Fixtures |
|----|-----------|----------|
| APF-001 | One valid payment → one authorization | vulnerable-x402 / fixed-x402 |
| APF-002 | Shared budget race — only one wins | vulnerable-x402 / fixed-x402 |
| APF-003 | Crash after broadcast keeps reservation frozen | vulnerable-cdp / fixed-cdp |
| APF-004 | Wrong transfer → RECONCILIATION_REQUIRED | settlement verifier |
| APF-005 | Stale approval rejected at execute | vulnerable-cdp / fixed-cdp |
| APF-006 | On-chain hook blocks policy bypass | smart-account |

## Quick start

```bash
npm install
npm test
npm run lab
npm run lab -- --profiles APF-003 --format sarif --output evidence.sarif
```

## GitHub Action

```yaml
- uses: prasanthkuna/agent-payment-failure-lab@v0.1.0
  with:
    profiles: APF-003,APF-004
    format: sarif
```

## CLI options

```text
--profiles APF-001,APF-003   Run specific profiles
--format json|junit|sarif     Output format
--output path                 Write to file
```

## Ecosystem map

| Source repo | Profiles |
|-------------|----------|
| x402-guard | APF-001, APF-002 |
| railguard-gateway/ | APF-003, APF-004, APF-005 |
| railguard-protocol | APF-006 |

## Documentation

- [INTEGRATION.md](./docs/INTEGRATION.md) — 5-minute CI setup
- [POSTMORTEM-APF-003](./docs/POSTMORTEM-APF-003.md) — crash-after-broadcast bug
- [Public evidence](https://github.com/prasanthkuna/railguard-protocol/tree/master/evidence)

## License

Apache-2.0
