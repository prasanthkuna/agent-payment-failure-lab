import type { ProfileEvidence } from "./types.js"

export function toJsonReport(evidence: ProfileEvidence[], meta: Record<string, unknown> = {}) {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      tool: "agent-payment-failure-lab",
      version: "0.1.0",
      ...meta,
      results: evidence,
    },
    null,
    2,
  )
}

export function toJUnitReport(evidence: ProfileEvidence[]): string {
  const failures = evidence.filter((entry) => entry.result === "FAIL")
  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<testsuites tests="${evidence.length}" failures="${failures.length}">`,
    `<testsuite name="agent-payment-failure-lab" tests="${evidence.length}" failures="${failures.length}">`,
    ...evidence.map((entry) => {
      if (entry.result === "FAIL") {
        return `  <testcase name="${entry.profile}:${entry.fixture}"><failure message="${entry.invariant}"/></testcase>`
      }
      return `  <testcase name="${entry.profile}:${entry.fixture}"/>`
    }),
    `</testsuite>`,
    `</testsuites>`,
  ]
  return xml.join("\n")
}

export function toSarifReport(evidence: ProfileEvidence[]): string {
  const runs = evidence.map((entry) => ({
    ruleId: entry.profile,
    level: entry.severity === "critical" ? "error" : "warning",
    message: { text: entry.invariant },
    status: entry.result,
    fingerprint: entry.evidence_hash,
  }))
  return JSON.stringify(
    {
      version: "2.1.0",
      $schema: "https://json.schemastore.org/sarif-2.1.0.json",
      runs: [
        {
          tool: { driver: { name: "agent-payment-failure-lab", version: "0.1.0" } },
          results: runs.map((r) => ({
            ruleId: r.ruleId,
            level: r.level,
            message: r.message,
            properties: { status: r.status, fingerprint: r.fingerprint },
          })),
        },
      ],
    },
    null,
    2,
  )
}
