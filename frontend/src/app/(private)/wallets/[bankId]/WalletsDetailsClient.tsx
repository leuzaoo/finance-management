"use client";
import React from "react";
import { useWalletDetails } from "@/src/hooks/useWalletDetails";
import { WalletHeader } from "@/src/components/wallets/WalletHeader";
import { TransactionsSection } from "@/src/components/wallets/TransactionsSection";
import { ChartsSection } from "@/src/components/wallets/ChartsSection";
import { SubscriptionsSection } from "@/src/components/wallets/SubscriptionsSection";
import TransactionModal from "@/src/components/forms/TransactionModal";
import SubscriptionModal from "@/src/components/forms/SubscriptionModal";
import { ToastContainer } from "react-toastify";

export default function WalletDetailsClient({ bankId }: { bankId: string }) {
  const {
    bank,
    loading,
    isBankLoading,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    txModalOpen,
    setTxModalOpen,
    subModalOpen,
    setSubModalOpen,
    editingSub,
    setEditingSub,
    transactions,
    categorySummary,
    filteredChartData,
    isCategoryLoading,
    fetchBank,
    listTransactions,
    getCategorySummary,
    listSubscriptions,
    handleDeleteTx,
    handleDeleteSub,
  } = useWalletDetails(bankId);

  if (loading || isBankLoading) return <p>Carregando…</p>;
  if (!bank) return <p>Banco não encontrado.</p>;

  return (
    <>
      <ToastContainer />

      <TransactionModal
        bankId={bankId}
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        currencyType={bank.currencyType}
        onSuccess={() => {
          fetchBank();
          listTransactions(bankId, {
            from: fromDate ?? undefined,
            to: toDate ?? undefined,
          });
          getCategorySummary(bankId, {
            from: fromDate ?? undefined,
            to: toDate ?? undefined,
          });
        }}
      />
      <SubscriptionModal
        bankId={bankId}
        isOpen={subModalOpen}
        onClose={() => setSubModalOpen(false)}
        currencyType={bank.currencyType}
        subscriptionToEdit={editingSub || undefined}
        onSuccess={() => {
          fetchBank();
          listSubscriptions(bankId);
        }}
      />

      <div className="2md:grid grid-cols-2 gap-8">
        <div>
          <WalletHeader
            bankName={bank.bankName}
            balance={bank.currencyValue}
            currency={bank.currencyType}
            onOpenModal={() => setTxModalOpen(true)}
          />

          <TransactionsSection
            bankId={bankId}
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            onDelete={handleDeleteTx}
          />
        </div>

        <div>
          <ChartsSection
            balanceData={filteredChartData}
            categoryData={categorySummary}
            currencyType={bank.currencyType}
            isCategoryLoading={isCategoryLoading}
          />

          <SubscriptionsSection
            bankId={bankId}
            currencyType={bank.currencyType}
            onAdd={() => setSubModalOpen(true)}
            onEdit={(sub) => setEditingSub(sub)}
            onDelete={handleDeleteSub}
          />
        </div>
      </div>
    </>
  );
}
