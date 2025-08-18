import { Response } from "express";
import mongoose from "mongoose";

import { AuthRequest } from "../middlewares/authenticate";

import Transaction from "../models/Transaction";
import Bank from "../models/Bank";

export const addTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { bankId } = req.params;
    const { type, amount, category, description, date } = req.body;

    const bank = await Bank.findOne({ _id: bankId, user: req.userId });
    if (!bank) {
      res.status(404).json({ message: "Banco não encontrado." });
      return;
    }

    const tx = await Transaction.create({
      bank: new mongoose.Types.ObjectId(bankId),
      type,
      amount,
      category,
      description,
      date: date || new Date(),
    });

    if (type === "expense") {
      bank.currencyValue -= amount;
    } else if (type === "income") {
      bank.currencyValue += amount;
    }

    await bank.save();

    res.status(201).json(tx);
    return;
  } catch (err: any) {
    console.error("addTransaction error:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar transação", error: err.message });
    return;
  }
};

export const listTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { bankId } = req.params;
    const from: Date | undefined = req.query.from as any;
    const to: Date | undefined = req.query.to as any;

    const bank = await Bank.findOne({ _id: bankId, user: req.userId });
    if (!bank) {
      res.status(404).json({ message: "Banco não encontrado." });
      return;
    }

    const filter: any = { bank: bankId };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const txs = await Transaction.find(filter).sort({ date: -1 }).lean();

    res.json(txs);
    return;
  } catch (err: any) {
    console.error("listTransactions error:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar transações", error: err.message });
    return;
  }
};

export const getRecentTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;

    const banks = await Bank.find({ user: userId }).select("_id").lean();
    const bankIds = banks.map((b) => b._id);

    if (bankIds.length === 0) {
      res.json([]);
      return;
    }

    const txs = await Transaction.find({ bank: { $in: bankIds } })
      .sort({ date: -1 })
      .limit(5)
      .populate({ path: "bank", select: "currencyType bankName" })
      .lean();

    res.json(txs);
  } catch (err: any) {
    console.error("getRecentTransactions error:", err);
    res.status(500).json({
      message: "Erro ao buscar transações recentes",
      error: err.message,
    });
  }
};

export const categorySummary = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { bankId } = req.params;

    const bank = await Bank.findOne({ _id: bankId, user: req.userId });
    if (!bank) {
      res.status(404).json({ message: "Banco não encontrado." });
      return;
    }

    const rawFrom = req.query.from as string | undefined;
    const rawTo = req.query.to as string | undefined;

    const fromDate = rawFrom ? new Date(rawFrom) : undefined;
    const toDate = rawTo ? new Date(rawTo) : undefined;

    const match: any = {
      bank: new mongoose.Types.ObjectId(bankId),
      type: "expense",
    };

    if (fromDate || toDate) {
      match.date = {};
      if (fromDate) match.date.$gte = fromDate;
      if (toDate) match.date.$lte = toDate;
    }

    const summary = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(summary);
  } catch (error: any) {
    console.error("categorySummary error:", error);
    res
      .status(500)
      .json({ message: "Erro ao agregar por categoria", error: error.message });
  }
};

export const deleteTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { bankId, txId } = req.params;

    const bank = await Bank.findOne({ _id: bankId, user: req.userId });
    if (!bank) {
      res.status(404).json({ message: "Banco não encontrado." });
      return;
    }

    const tx = await Transaction.findOne({ _id: txId, bank: bankId });
    if (!tx) {
      res.status(404).json({ message: "Transação não encontrada." });
      return;
    }

    if (tx.type === "expense") {
      bank.currencyValue += tx.amount;
    } else if (tx.type === "income") {
      bank.currencyValue -= tx.amount;
    }

    await bank.save();

    await Transaction.deleteOne({ _id: txId });

    res.status(200).json({ message: "Transação deletada com sucesso." });
    return;
  } catch (err: any) {
    console.error("deleteTransaction error:", err);
    res
      .status(500)
      .json({ message: "Erro ao deletar transação", error: err.message });
    return;
  }
};
