export type ProfileResult = "PASS" | "FAIL"
export type FixtureKind =
  | "vulnerable-x402"
  | "fixed-x402"
  | "vulnerable-cdp"
  | "fixed-cdp"
  | "smart-account"

export type Severity = "critical" | "high" | "medium"

export interface ProfileEvidence {
  profile: string
  result: ProfileResult
  fixture: FixtureKind | "settlement" | "policy"
  invariant: string
  severity: Severity
  observed_state?: Record<string, unknown>
  evidence_hash: string
}

export interface ProfileRun {
  id: string
  invariant: string
  severity: Severity
  fixtures: Array<{ fixture: FixtureKind | "settlement" | "policy"; expected: ProfileResult }>
  run: (fixture: FixtureKind | "settlement" | "policy") => ProfileResult
}
