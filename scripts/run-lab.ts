#!/usr/bin/env npx tsx
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import { runLab, summarize } from "../packages/core/src/runner.ts"
import { toJsonReport, toJUnitReport, toSarifReport } from "../packages/core/src/reporters.ts"

interface CliOptions {
  formats: string[]
  profiles?: string[]
  output?: string
  help: boolean
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { formats: ["json"], help: false }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--help" || arg === "-h") {
      options.help = true
    } else if (arg === "--format" && argv[i + 1]) {
      options.formats = [argv[++i]]
    } else if (arg === "--output" && argv[i + 1]) {
      options.output = argv[++i]
    } else if (arg === "--profiles" && argv[i + 1]) {
      options.profiles = argv[++i].split(",").map((p) => p.trim()).filter(Boolean)
    } else if (arg.startsWith("--profiles=")) {
      options.profiles = arg.slice("--profiles=".length).split(",").map((p) => p.trim()).filter(Boolean)
    } else if (arg === "--output-format" && argv[i + 1]) {
      options.formats = argv[++i].split(",").map((f) => f.trim()).filter(Boolean)
    }
  }

  return options
}

function printHelp(): void {
  console.log(`agent-payment-failure-lab v0.1.0

Usage:
  apf-lab [options]
  npm run lab -- [options]

Options:
  --profiles APF-001,APF-003   Run specific profiles (default: all)
  --format json|junit|sarif    Output format (default: json)
  --output-format a,b,c        Comma-separated formats (alias)
  --output path                Write output to file (uses first format)
  --help, -h                   Show this help

Examples:
  npm run lab -- --profiles APF-003 --format sarif
  npm run lab -- --profiles APF-003,APF-004 --output evidence/results.json
`)
}

function render(format: string, evidence: ReturnType<typeof runLab>, summary: ReturnType<typeof summarize>): string {
  if (format === "junit") return toJUnitReport(evidence)
  if (format === "sarif") return toSarifReport(evidence)
  return toJsonReport(evidence, { summary })
}

const options = parseArgs(process.argv.slice(2))

if (options.help) {
  printHelp()
  process.exit(0)
}

const evidence = runLab({ profiles: options.profiles })
const summary = summarize(evidence)
const primaryFormat = options.formats[0] ?? "json"
const output = render(primaryFormat, evidence, summary)

if (options.output) {
  const outPath = options.output
  const dir = dirname(outPath)
  if (dir && dir !== ".") mkdirSync(dir, { recursive: true })
  writeFileSync(outPath, output)
  console.error(`Wrote ${outPath}`)
} else {
  console.log(output)
}

process.exit(summary.ok ? 0 : 1)
