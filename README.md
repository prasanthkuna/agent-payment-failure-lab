# Agent Payment Failure Lab

Executable tests that detect failures in autonomous and stablecoin payment integrations.

> **Build first, grant after.** Ship this lab, then apply for Base / CDP / Stellar / NLnet with proof — not roadmaps.

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
npm run lab:sarif > evidence.sarif
```

## Output

```json
{
  "profile": "APF-003",
  "result": "PASS",
  "fixture": "fixed-cdp",
  "invariant": "budget must remain reserved after broadcast",
  "severity": "critical",
  "evidence_hash": "..."
}
```

## Ecosystem map

| Source repo | Profiles |
|-------------|----------|
| x402-guard | APF-001, APF-002 |
| railguard-cdp | APF-003, APF-004, APF-005 |
| railguard-new | APF-006 |

## License

Apache-2.0
