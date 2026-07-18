# APF-003 Post-mortem: Crash after broadcast releases budget

## Invariant

> A broadcast payment must retain its guard reservation until settlement is known.

## Failure (vulnerable CDP path)

1. CDP returns `tx_hash`
2. Post-broadcast step throws (RPC timeout, DB error)
3. Payment → `unknown`
4. Guard authorization **released** (bug)
5. Budget overstated; another payment authorized

## Fix (fixed CDP path)

1. `tx_hash` present → `guard_status = frozen`
2. Retry blocked while `unknown`
3. Reconciler verifies settlement facts
4. On confirm → `commitAuthorization` → `committed`

## Proof

```bash
cd agent-payment-failure-lab
npm test   # APF-003 fixed-cdp PASS
cd ../coinbase
bun test apps/api/payment-lifecycle.test.ts
```

## Severity

**Critical** — silent double-spend risk in agent treasury systems.
