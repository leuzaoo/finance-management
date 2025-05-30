"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useBankStore, type Bank } from "@/src/store/useBankStore";
import { toast } from "react-toastify";

import CurrencyValue from "@/src/components/utils/CurrencyValue";
import WalletHistory from "@/src/components/ui/WalletHistory";

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
        toast.error("Não foi possível carregar os dados do banco.");
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
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{bank.bankName}</h2>
      <div className="text-3xl font-semibold">
        {bank.currencyValue}{" "}
        <span className="text-lg opacity-60">{bank.currencyType}</span>
      </div>
      <p className="text-sm text-gray-500">
        Criado em: {new Date(bank.createdAt).toLocaleDateString("pt-BR")}
      </p>
      <WalletHistory bankId={bankId} />
    </div>
  );
}
