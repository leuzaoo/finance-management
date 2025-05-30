import * as React from "react";
import { redirect } from "next/navigation";

import WalletDetailsClient from "./WalletsDetailsClient";

export default function WalletDetailsPage({
  params,
}: {
  params: Promise<{ bankId: string }>;
}) {
  const { bankId } = React.use(params);

  if (!bankId) return redirect("/dashboard");
  return <WalletDetailsClient bankId={bankId} />;
}
