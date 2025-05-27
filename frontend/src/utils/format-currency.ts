export function formatCurrency(value: number): string {
  return Intl.NumberFormat("pt-BR", {
    style: "decimal",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
