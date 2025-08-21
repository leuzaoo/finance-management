import React from "react";
import TitlePage from "../common/TitlePage";
import { XIcon } from "lucide-react";

const TransactionInfoCard = () => {
  return (
    <div className="bg-grey mx-auto mt-20 w-full rounded-2xl bg-white p-3 shadow-sm dark:bg-black">
      <div className="flex items-start justify-between">
        <TitlePage text="Título" />
        <button>
          <XIcon />
        </button>
      </div>
      <p className="text-sm opacity-60">Aqui será a descrição da transação.</p>
      <div className="mt-10 flex w-full items-end justify-between">
        <span className="font-zona-pro text-xl font-bold">25,40 GBP</span>
        <span className="text-sm opacity-50">Wise</span>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
