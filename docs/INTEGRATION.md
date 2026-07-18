# Integration guide — 5 minutes

Run adversarial payment failure profiles in your CI without custom code.

## Option 1: Reusable GitHub Action (recommended)

```yaml
name: Payment Safety

on:
  pull_request:
    paths:
      - "src/payments/**"
      - "docker-compose.yml"

jobs:
  adversarial-payment-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: prasanthkuna/agent-payment-failure-lab@v0.1.0
        with:
          profiles: APF-003,APF-004
          format: sarif
          artifact-name: apf-evidence
```

### Inputs

| Input | Default | Description |
|-------|---------|-------------|
| `profiles` | all | Comma-separated APF IDs |
| `format` | `sarif` | `json`, `junit`, or `sarif` |
| `upload-artifact` | `true` | Upload evidence file |
| `artifact-name` | `apf-evidence` | Artifact name |

### Outputs

| Output | Description |
|--------|-------------|
| `pass` | `true` if all profiles passed |
| `evidence-path` | Path to generated evidence |

## Option 2: CLI in your workflow

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/checkout@v4
    with:
      repository: prasanthkuna/agent-payment-failure-lab
      path: apf-lab

  - uses: actions/setup-node@v4
    with:
      node-version: "20"

  - name: Run APF-003
    run: |
      cd apf-lab
      npm ci
      npm run lab -- --profiles APF-003 --format sarif --output ../apf.sarif

  - uses: actions/upload-artifact@v4
    with:
      name: apf-evidence
      path: apf.sarif
```

## Option 3: Local development

```bash
git clone https://github.com/prasanthkuna/agent-payment-failure-lab.git
cd agent-payment-failure-lab
npm install

# All profiles
npm run lab

# Specific profiles
npm run lab -- --profiles APF-003,APF-004

# SARIF for code scanning
npm run lab -- --profiles APF-003 --format sarif --output results.sarif
```

## Profile reference

| ID | Invariant | Severity |
|----|-----------|----------|
| APF-001 | One payment proof → one authorization | critical |
| APF-002 | Shared budget allows one concurrent auth | critical |
| APF-003 | Budget frozen after broadcast | critical |
| APF-004 | Wrong transfer → reconciliation | critical |
| APF-005 | Stale approval rejected | high |
| APF-006 | On-chain session blocks bypass | critical |

## Testing your own integration (future)

Adapter support is planned. Today, profiles run in-memory fixtures. To validate your CDP/x402 implementation, run the corresponding tests in `railguard-cdp` or `x402-guard` alongside this Action.

## Support

- Issues: https://github.com/prasanthkuna/agent-payment-failure-lab/issues
- Evidence index: https://github.com/prasanthkuna/railguard-new/tree/master/evidence
