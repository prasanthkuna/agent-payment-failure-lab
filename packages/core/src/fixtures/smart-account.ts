/** On-chain session hook simulation for APF-006. */

export interface SessionConfig {
  maxPerTransfer: bigint
  maxTotalSpend: bigint
  allowedRecipient: string
  allowedToken: string
}

export class SmartAccountHook {
  constructor(
    private readonly config: SessionConfig,
    private totalSpent = 0n,
  ) {}

  preCheck(transfer: {
    token: string
    recipient: string
    amount: bigint
  }): boolean {
    if (transfer.token !== this.config.allowedToken) return false
    if (transfer.recipient !== this.config.allowedRecipient) return false
    if (transfer.amount > this.config.maxPerTransfer) return false
    if (this.totalSpent + transfer.amount > this.config.maxTotalSpend) return false
    return true
  }

  postCheck(amount: bigint): void {
    this.totalSpent += amount
  }

  /** Agent bypasses off-chain policy but hook still enforces. */
  executeWithSession(transfer: { token: string; recipient: string; amount: bigint }): boolean {
    if (!this.preCheck(transfer)) return false
    this.postCheck(transfer.amount)
    return true
  }
}

export function policyMiddlewareAllows(): boolean {
  return false // bypassed by agent
}
