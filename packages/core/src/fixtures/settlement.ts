/** Settlement fact verification (mirrors @railguard/settlement). */

export type SettlementStatus = "CONFIRMED" | "REVERTED" | "RECONCILIATION_REQUIRED" | "PENDING"

const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

export interface TransferLog {
  address: string
  topics: string[]
  data: string
}

export function verifyTransferFacts(input: {
  receiptStatus: "success" | "reverted"
  transfers: TransferLog[]
  expected: { token: string; recipient: string; amount: bigint }
}): SettlementStatus {
  if (input.receiptStatus === "reverted") return "REVERTED"
  for (const log of input.transfers) {
    if (log.topics[0] !== TRANSFER_TOPIC) continue
    const to = `0x${log.topics[2]!.slice(-40)}`.toLowerCase()
    const amount = BigInt(`0x${log.data.slice(-64)}`)
    if (
      log.address.toLowerCase() === input.expected.token.toLowerCase() &&
      to === input.expected.recipient.toLowerCase() &&
      amount === input.expected.amount
    ) {
      return "CONFIRMED"
    }
  }
  return "RECONCILIATION_REQUIRED"
}

export function makeTransferLog(token: string, recipient: string, amount: bigint): TransferLog {
  const to = recipient.toLowerCase().replace("0x", "").padStart(64, "0")
  const data = `0x${amount.toString(16).padStart(64, "0")}`
  const from = `${"0".repeat(64)}`
  return {
    address: token,
    topics: [TRANSFER_TOPIC, `0x${from}`, `0x${to}`],
    data,
  }
}
