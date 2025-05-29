import { Request, Response } from "express";
import Bank from "../models/Bank";
import Transaction, { ITransaction } from "../models/Transaction";
import { AuthRequest } from "../middlewares/authenticate";
import mongoose from "mongoose";

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
