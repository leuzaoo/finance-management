export function formatCurrency(value: number): string {
  return Intl.NumberFormat("pt-BR", {
    style: "decimal",
    currency: "BRL",
  }).format(value / 100);
}
