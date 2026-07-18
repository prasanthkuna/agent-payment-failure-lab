import { createHash } from "node:crypto"
import { ALL_PROFILES } from "./profiles/index.js"
import type { FixtureKind, ProfileEvidence, ProfileResult } from "./types.js"

export interface RunOptions {
  profiles?: string[]
}

function hashEvidence(input: Omit<ProfileEvidence, "evidence_hash">): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex")
}

export function runProfile(
  profileId: string,
  fixture: FixtureKind | "settlement" | "policy",
): ProfileEvidence {
  const profile = ALL_PROFILES.find((entry) => entry.id === profileId)
  if (!profile) throw new Error(`unknown profile: ${profileId}`)
  const expected = profile.fixtures.find((entry) => entry.fixture === fixture)?.expected
  const raw = profile.run(fixture)
  const result: ProfileResult =
    expected === undefined ? raw : raw === expected ? "PASS" : "FAIL"
  const base = {
    profile: profile.id,
    result,
    fixture,
    invariant: profile.invariant,
    severity: profile.severity,
    observed_state: { raw_result: raw, expected },
  }
  return { ...base, evidence_hash: hashEvidence(base) }
}

export function runLab(options: RunOptions = {}): ProfileEvidence[] {
  const selected = options.profiles
    ? ALL_PROFILES.filter((profile) => options.profiles!.includes(profile.id))
    : ALL_PROFILES
  const evidence: ProfileEvidence[] = []
  for (const profile of selected) {
    for (const { fixture } of profile.fixtures) {
      evidence.push(runProfile(profile.id, fixture))
    }
  }
  return evidence
}

export function summarize(evidence: ProfileEvidence[]) {
  const pass = evidence.filter((entry) => entry.result === "PASS").length
  const fail = evidence.length - pass
  return { total: evidence.length, pass, fail, ok: fail === 0 }
}
