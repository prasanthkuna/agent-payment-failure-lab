# Contributing

Thank you for helping improve payment safety testing for agent and stablecoin systems.

## Quick start

```bash
git clone https://github.com/prasanthkuna/agent-payment-failure-lab.git
cd agent-payment-failure-lab
npm install
npm test
npm run lab
```

## Adding a profile

1. Define invariant, severity, and fixtures in `packages/core/src/profiles/index.ts`
2. Add vulnerable + fixed fixtures in `packages/core/src/fixtures/`
3. Add tests in `packages/core/src/lab.test.ts`
4. Update README profile table

## Pull request checklist

- [ ] `npm test` passes
- [ ] `npm run typecheck` passes
- [ ] New profiles have both vulnerable and fixed fixtures
- [ ] Evidence hash is deterministic for fixed inputs
- [ ] README updated if public interface changes

## Code style

- TypeScript strict mode
- Pure functions for invariant logic
- No network calls in default fixtures

## Adapters (future)

External rail adapters (CDP, x402, Stellar) will live in separate packages. Do not add rail-specific dependencies to `packages/core` without discussion.
