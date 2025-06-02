"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useBankStore, type Bank } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

import WalletHistory from "@/src/components/ui/WalletHistory";
import TitlePage from "@/src/components/common/TitlePage";

interface Props {
  bankId: string;
}

export default function WalletDetailsClient({ bankId }: Props) {
  const { getBankById, isLoading } = useBankStore();
  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!bankId) return router.push("/dashboard");

    (async () => {
      try {
        setLoading(true);
        const data = await getBankById(bankId);
        setBank(data);
      } catch (error: unknown) {
        console.error({ message: "Erro ao buscar dados do banco", error });
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [bankId, getBankById, router]);

  if (loading || isLoading) {
    return <div>Carregando dados do banco…</div>;
  }

  if (!bank) {
    return <div>Banco não encontrado.</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <TitlePage text={bank.bankName} />
        <div className="flex flex-col">
          <span className="text-light/50 font-light">saldo da conta</span>
          <p className="text-3xl font-semibold">
            {formatCurrency(bank.currencyValue)}{" "}
            <span className="text-base opacity-60">{bank.currencyType}</span>
          </p>
        </div>
        <p className="text-light/50 text-sm font-light">
          Banco adicionado em:{" "}
          {new Date(bank.createdAt).toLocaleDateString("pt-BR")}
        </p>
        <WalletHistory bankId={bankId} />
      </div>
    </>
  );
}
