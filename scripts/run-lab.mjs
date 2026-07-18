#!/usr/bin/env node
/**
 * CLI shim for apf-lab bin — delegates to run-lab.ts via tsx.
 */
import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const labScript = join(__dirname, "run-lab.ts")

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["tsx", labScript, ...process.argv.slice(2)],
  { stdio: "inherit", shell: process.platform === "win32" },
)

process.exit(result.status ?? 1)
