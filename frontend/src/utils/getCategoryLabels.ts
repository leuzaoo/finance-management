import { TRANSACTION_CATEGORIES } from "./transaction.categories";

export function getCategoryLabel(value: string): string {
  const found = TRANSACTION_CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}
