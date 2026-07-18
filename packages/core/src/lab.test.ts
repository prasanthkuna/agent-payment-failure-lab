import { describe, expect, it } from "vitest"
import { runLab, summarize } from "./runner.js"

describe("agent payment failure lab", () => {
  it("runs all APF profiles with expected pass/fail matrix", () => {
    const evidence = runLab()
    expect(evidence.length).toBeGreaterThanOrEqual(10)
    const summary = summarize(evidence)
    expect(summary.pass).toBe(summary.total)
    expect(summary.ok).toBe(true)
  })

  it("APF-003 fixed fixture passes crash-after-broadcast invariant", () => {
    const entry = runLab({ profiles: ["APF-003"] }).find(
      (e) => e.fixture === "fixed-cdp",
    )
    expect(entry?.result).toBe("PASS")
  })

  it("APF-001 vulnerable fixture fails as expected", () => {
    const entry = runLab({ profiles: ["APF-001"] }).find(
      (e) => e.fixture === "vulnerable-x402",
    )
    expect(entry?.result).toBe("PASS")
  })
})
