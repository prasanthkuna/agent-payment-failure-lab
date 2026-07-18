# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a vulnerability

Email **security@railguard.ai** (or open a private security advisory on GitHub).

Please include:

- Profile ID affected (e.g. APF-003)
- Steps to reproduce
- Expected vs observed invariant behavior
- Whether the issue is in a fixture, adapter, or target integration

## Response timeline

| Severity | Initial response | Fix target |
|----------|------------------|------------|
| Critical (financial invariant bypass) | 48 hours | 7 days |
| High | 5 business days | 30 days |
| Medium/Low | 10 business days | Best effort |

## Scope

This lab tests payment safety invariants. It does **not** execute real financial transactions unless you configure a custom adapter that does so. Default fixtures are in-memory simulations.

## Safe use

- Do not point adapters at production wallets without explicit safeguards
- Run profiles in isolated CI environments
- Review SARIF output before merging payment-related changes
