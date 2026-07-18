#!/usr/bin/env npx tsx
import { runLab, summarize } from "../packages/core/src/runner.ts"
import { toJsonReport, toJUnitReport, toSarifReport } from "../packages/core/src/reporters.ts"

const format = process.argv.includes("--format")
  ? process.argv[process.argv.indexOf("--format") + 1]
  : "json"

const evidence = runLab()
const summary = summarize(evidence)

if (format === "junit") {
  console.log(toJUnitReport(evidence))
} else if (format === "sarif") {
  console.log(toSarifReport(evidence))
} else {
  console.log(toJsonReport(evidence, { summary }))
}

process.exit(summary.ok ? 0 : 1)
