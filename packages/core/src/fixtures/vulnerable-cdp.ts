/** CDP-style execution lifecycle for APF-003/005. */

export type GuardStatus = "reserved" | "committed" | "released" | "frozen"
export type PaymentStatus = "prepared" | "executing" | "submitted" | "unknown" | "confirmed" | "failed" | "reconciliation_required"

export interface PaymentRecord {
  status: PaymentStatus
  txHash?: string
  guardStatus?: GuardStatus
  approvalHash: string
  currentPolicyHash: string
}

export class VulnerableCdpExecutor {
  private payment: PaymentRecord = {
    status: "prepared",
    approvalHash: "",
    currentPolicyHash: "",
  }

  setPolicyHash(hash: string): void {
    this.payment.currentPolicyHash = hash
  }

  approve(hash: string): void {
    this.payment.approvalHash = hash
  }

  async execute(broadcastFailsAfterTx = false): Promise<void> {
    this.payment.guardStatus = "reserved"
    this.payment.status = "executing"
    this.payment.txHash = "0xbroadcast"
    this.payment.status = "submitted"
    if (broadcastFailsAfterTx) {
      this.payment.status = "unknown"
      this.payment.guardStatus = "released" // BUG
    }
  }

  get(): PaymentRecord {
    return this.payment
  }
}

export class FixedCdpExecutor {
  private payment: PaymentRecord = {
    status: "prepared",
    approvalHash: "",
    currentPolicyHash: "",
  }

  setPolicyHash(hash: string): void {
    this.payment.currentPolicyHash = hash
  }

  approve(hash: string): void {
    this.payment.approvalHash = hash
  }

  ensurePayable(): void {
    if (this.payment.approvalHash !== this.payment.currentPolicyHash) {
      throw new Error("stale approval")
    }
  }

  async execute(broadcastFailsAfterTx = false): Promise<void> {
    this.ensurePayable()
    this.payment.guardStatus = "reserved"
    this.payment.status = "executing"
    this.payment.txHash = "0xbroadcast"
    this.payment.status = "submitted"
    if (broadcastFailsAfterTx) {
      this.payment.status = "unknown"
      this.payment.guardStatus = "frozen"
      return
    }
    this.payment.status = "confirmed"
    this.payment.guardStatus = "committed"
  }

  reconcileOnConfirm(): void {
    if (this.payment.status === "unknown" && this.payment.txHash) {
      this.payment.status = "confirmed"
      this.payment.guardStatus = "committed"
    }
  }

  get(): PaymentRecord {
    return this.payment
  }
}
