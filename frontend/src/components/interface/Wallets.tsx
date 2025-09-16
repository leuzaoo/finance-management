"use client";
import { useEffect, useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";

import { useBankStore } from "@/src/store/useBankStore";

import TitlePage from "../common/TitlePage";
import BankModal from "../forms/BankModal";
import WalletCard from "../ui/WalletCard";

export function Wallets() {
  const [modalOpen, setModalOpen] = useState(false);
  const { banks, isLoading, listBanks, addBank } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  const handleCreate = async (data: {
    bankName: string;
    currencyType: string;
    initialValue?: number;
  }) => {
    await addBank(data.bankName, data.currencyType, data.initialValue);
    setModalOpen(false);
  };

  const skeletons = useMemo(
    () =>
      new Array(4).fill(0).map((_, i) => (
        <div
          key={`s-${i}`}
          className="h-[196px] rounded-2xl border border-black/5 bg-white/60 shadow-sm dark:bg-white/5"
        >
          <div className="h-full w-full animate-pulse rounded-2xl bg-gradient-to-br from-black/5 to-black/0 dark:from-white/10" />
        </div>
      )),
    [],
  );

  return (
    <section className="mx-auto max-w-5xl pb-8 2md:mt-10">
      <div className="mb-4 flex items-center justify-between">
        <TitlePage text="Cartões" />
        <button
          onClick={() => setModalOpen(true)}
          className="group inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-white transition hover:translate-y-[-1px] hover:bg-black/80 active:translate-y-0 dark:bg-white dark:text-black dark:hover:bg-white/90"
          aria-label="Adicionar cartão"
          title="Adicionar cartão"
        >
          <PlusIcon size={18} className="transition group-hover:rotate-90" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      <BankModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {skeletons}
        </div>
      ) : banks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center dark:border-white/10">
          <p className="text-xl font-medium md:text-2xl md:font-semibold">
            Nenhum cartão cadastrado
          </p>
          <p className="mt-1 text-sm font-light opacity-70 md:text-base">
            Adicione cartões para começar a gerenciar suas finanças.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:translate-y-[-1px] hover:bg-blue-500 active:translate-y-0"
          >
            <PlusIcon size={18} />
            Novo cartão
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {banks.map((bank) => (
            <WalletCard key={bank.id} bank={bank} />
          ))}
        </div>
      )}
    </section>
  );
}
