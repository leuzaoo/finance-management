"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { PlusCircleIcon } from "lucide-react";

import { useBankStore, type Bank } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

import TransactionModal from "@/src/components/forms/TransactionModal";
import WalletHistory from "@/src/components/ui/WalletHistory";
import TitlePage from "@/src/components/common/TitlePage";

interface Props {
  bankId: string;
}

export default function WalletDetailsClient({ bankId }: Props) {
  const { getBankById, isLoading } = useBankStore();
  const [isModalOpen, setModalOpen] = useState(false);
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
      <ToastContainer autoClose={2000} />
      <div className="space-y-4">
        <div className="flex items-end gap-2">
          <TitlePage text={bank.bankName} />
          <span className="text-lg opacity-60">{bank.currencyType}</span>
        </div>
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col">
            <span className="text-light/50 font-light">saldo da conta</span>
            <p className="text-3xl font-semibold">
              {formatCurrency(bank.currencyValue)}{" "}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-light text-dark flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1 text-lg hover:opacity-60"
          >
            Novo <PlusCircleIcon size={20} />
          </button>
        </div>
        <p className="text-light/50 text-sm font-light">
          Banco adicionado em:{" "}
          {new Date(bank.createdAt).toLocaleDateString("pt-BR")}
        </p>

        <TransactionModal
          bankId={bankId}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          currencyType={bank.currencyType}
        />

        <WalletHistory bankId={bankId} />
      </div>
    </>
  );
}
