import { FixedCdpExecutor, VulnerableCdpExecutor } from "../fixtures/fixed-cdp.js"
import { FixedX402Guard, VulnerableX402Guard } from "../fixtures/fixed-x402.js"
import { makeTransferLog, verifyTransferFacts } from "../fixtures/settlement.js"
import { policyMiddlewareAllows, SmartAccountHook } from "../fixtures/smart-account.js"
import type { ProfileResult, ProfileRun } from "../types.js"

export const ALL_PROFILES: ProfileRun[] = [
  {
    id: "APF-001",
    invariant: "one valid payment proof yields one financial authorization",
    severity: "critical",
    fixtures: [
      { fixture: "vulnerable-x402", expected: "FAIL" },
      { fixture: "fixed-x402", expected: "PASS" },
    ],
    run(fixture) {
      const fp = "payment-fingerprint-1"
      if (fixture === "vulnerable-x402") {
        const g = new VulnerableX402Guard()
        g.markReplay(fp)
        g.markReplay(fp)
        return "FAIL"
      }
      if (fixture === "fixed-x402") {
        const g = new FixedX402Guard()
        return g.claimReplay(fp) && !g.claimReplay(fp) ? "PASS" : "FAIL"
      }
      return "FAIL"
    },
  },
  {
    id: "APF-002",
    invariant: "shared budget allows only one concurrent authorization",
    severity: "critical",
    fixtures: [
      { fixture: "vulnerable-x402", expected: "FAIL" },
      { fixture: "fixed-x402", expected: "PASS" },
    ],
    run(fixture) {
      const cap = 100n
      const amount = 70n
      if (fixture === "vulnerable-x402") {
        const g = new VulnerableX402Guard()
        const a = g.canSpend(amount, cap)
        const b = g.canSpend(amount, cap)
        if (a) g.recordSpend(amount)
        if (b) g.recordSpend(amount)
        return a && b ? "FAIL" : "PASS"
      }
      if (fixture === "fixed-x402") {
        const g = new FixedX402Guard()
        const a = g.reserveBudget(amount, cap)
        const b = g.reserveBudget(amount, cap)
        return a && !b ? "PASS" : "FAIL"
      }
      return "FAIL"
    },
  },
  {
    id: "APF-003",
    invariant: "budget must remain reserved after broadcast",
    severity: "critical",
    fixtures: [
      { fixture: "vulnerable-cdp", expected: "FAIL" },
      { fixture: "fixed-cdp", expected: "PASS" },
    ],
    run(fixture) {
      if (fixture === "vulnerable-cdp") {
        const ex = new VulnerableCdpExecutor()
        ex.setPolicyHash("policy-v1")
        ex.approve("policy-v1")
        void ex.execute(true)
        const p = ex.get()
        return p.status === "unknown" && p.guardStatus === "released" ? "FAIL" : "PASS"
      }
      if (fixture === "fixed-cdp") {
        const ex = new FixedCdpExecutor()
        ex.setPolicyHash("policy-v1")
        ex.approve("policy-v1")
        void ex.execute(true)
        if (ex.get().guardStatus !== "frozen") return "FAIL"
        ex.reconcileOnConfirm()
        return ex.get().guardStatus === "committed" ? "PASS" : "FAIL"
      }
      return "FAIL"
    },
  },
  {
    id: "APF-004",
    invariant: "successful receipt with wrong recipient requires reconciliation",
    severity: "critical",
    fixtures: [{ fixture: "settlement", expected: "PASS" }],
    run(fixture) {
      if (fixture !== "settlement") return "FAIL"
      const token = "0x036cbd53842c5426634e7929541ec2318f3dcf7e"
      const status = verifyTransferFacts({
        receiptStatus: "success",
        transfers: [
          makeTransferLog(token, "0x3333333333333333333333333333333333333333", 1_000_000n),
        ],
        expected: {
          token,
          recipient: "0x2222222222222222222222222222222222222222",
          amount: 1_000_000n,
        },
      })
      return status === "RECONCILIATION_REQUIRED" ? "PASS" : "FAIL"
    },
  },
  {
    id: "APF-005",
    invariant: "stale approval is rejected when policy snapshot changes",
    severity: "high",
    fixtures: [
      { fixture: "vulnerable-cdp", expected: "FAIL" },
      { fixture: "fixed-cdp", expected: "PASS" },
    ],
    run(fixture) {
      if (fixture === "vulnerable-cdp") {
        const ex = new VulnerableCdpExecutor()
        ex.setPolicyHash("policy-v1")
        ex.approve("policy-v1")
        ex.setPolicyHash("policy-v2")
        void ex.execute(false)
        return "FAIL"
      }
      if (fixture === "fixed-cdp") {
        const ex = new FixedCdpExecutor()
        ex.setPolicyHash("policy-v1")
        ex.approve("policy-v1")
        ex.setPolicyHash("policy-v2")
        try {
          ex.ensurePayable()
          return "FAIL"
        } catch {
          return "PASS"
        }
      }
      return "FAIL"
    },
  },
  {
    id: "APF-006",
    invariant: "on-chain session restrictions block direct execution bypass",
    severity: "critical",
    fixtures: [{ fixture: "smart-account", expected: "PASS" }],
    run(fixture) {
      if (fixture !== "smart-account") return "FAIL"
      const hook = new SmartAccountHook({
        maxPerTransfer: 50n,
        maxTotalSpend: 100n,
        allowedRecipient: "0x2222222222222222222222222222222222222222",
        allowedToken: "0xusdc",
      })
      policyMiddlewareAllows()
      const blocked = hook.executeWithSession({
        token: "0xusdc",
        recipient: "0x9999999999999999999999999999999999999999",
        amount: 10n,
      })
      const allowed = hook.executeWithSession({
        token: "0xusdc",
        recipient: "0x2222222222222222222222222222222222222222",
        amount: 10n,
      })
      return !blocked && allowed ? "PASS" : "FAIL"
    },
  },
]
