"use client";
import React from "react";

import { WalletHistoryProps } from "../ui/WalletHistory";

import WalletHistory from "../ui/WalletHistory";

export function TransactionsSection(props: WalletHistoryProps) {
  return <WalletHistory {...props} />;
}
