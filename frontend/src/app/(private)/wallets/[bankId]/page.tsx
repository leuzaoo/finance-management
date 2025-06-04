import { redirect } from "next/navigation";
import WalletDetailsClient from "./WalletsDetailsClient";

export default async function WalletDetailsPage({
  params,
}: {
  params: Promise<{ bankId: string }>;
}) {
  const { bankId } = await params;

  if (!bankId) {
    return redirect("/dashboard");
  }

  return <WalletDetailsClient bankId={bankId} />;
}
