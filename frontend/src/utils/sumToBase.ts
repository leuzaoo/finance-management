import Big from "big.js";

export function sumToBase(
  balances: Record<string, number>,
  base: string,
  rates: Record<string, number> | null,
): number {
  if (!rates) return 0;
  let total = Big(0);
  for (const [code, amount] of Object.entries(balances)) {
    const rateXtoBase = code === base ? 1 : rates[code];
    if (!rateXtoBase) continue;
    total = total.plus(Big(amount).times(rateXtoBase));
  }
  return Number(total.toFixed(2));
}
