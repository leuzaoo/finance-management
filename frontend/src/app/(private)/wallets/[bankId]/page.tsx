import { redirect } from "next/navigation";

import WalletDetailsClient from "./WalletsDetailsClient";

interface PageProps {
  params: { bankId: string };
}

export default async function WalletDetailsPage({ params }: PageProps) {
  // mesmo que tenha um aviso no 'await' abaixo, de acordo com a documentacao do next, precisa usar await
  const { bankId } = await params;

  if (!bankId) return redirect("/dashboard");
  return <WalletDetailsClient bankId={bankId} />;
}
