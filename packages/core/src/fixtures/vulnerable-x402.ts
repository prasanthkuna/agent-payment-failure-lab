/** Minimal x402-style budget + replay primitives for APF-001/002. */

export class VulnerableX402Guard {
  private replays = new Set<string>()
  private spent = 0n

  hasReplay(fp: string): boolean {
    return this.replays.has(fp)
  }

  markReplay(fp: string): void {
    this.replays.add(fp)
  }

  /** TOCTOU: check then act separately. */
  canSpend(amount: bigint, cap: bigint): boolean {
    return this.spent + amount <= cap
  }

  recordSpend(amount: bigint): void {
    this.spent += amount
  }
}

export class FixedX402Guard {
  private replays = new Set<string>()
  private spent = 0n
  private reserved = 0n

  claimReplay(fp: string): boolean {
    if (this.replays.has(fp)) return false
    this.replays.add(fp)
    return true
  }

  reserveBudget(amount: bigint, cap: bigint): boolean {
    if (this.spent + this.reserved + amount > cap) return false
    this.reserved += amount
    return true
  }

  commitReservation(amount: bigint): void {
    if (this.reserved < amount) throw new Error("no reservation")
    this.reserved -= amount
    this.spent += amount
  }

  releaseReservation(amount: bigint): void {
    this.reserved -= amount
  }
}
