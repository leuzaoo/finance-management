export interface Wallet {
  id: number;
  name: string;
  slug: string;
  income: number;
  expense: number;
  currencyType: string;
}

export const MENU_WALLET_LIST: Wallet[] = [
  {
    id: 0,
    name: "Nubank",
    slug: "nubank",
    income: 1000,
    expense: 500,
    currencyType: "BRL",
  },
  {
    id: 1,
    name: "Itaú",
    slug: "itau",
    income: 1200,
    expense: 300,
    currencyType: "BRL",
  },
  {
    id: 2,
    name: "Wise",
    slug: "wise",
    income: 600,
    expense: 50,
    currencyType: "GBP",
  },
];
