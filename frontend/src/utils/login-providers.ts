export interface ProviderProps {
  id: number;
  name: string;
  icon: string;
  provider: "google" | "apple";
}

export const Providers: ProviderProps[] = [
  {
    id: 0,
    name: "Google",
    icon: "/google-icon.png",
    provider: "google",
  },
  {
    id: 1,
    name: "Apple",
    icon: "/apple-icon.svg",
    provider: "apple",
  },
];
