import { Response } from "express";

import { AuthRequest } from "../types";

import Bank from "../models/Bank";

export const addBank = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { bankName, currencyType } = req.body;

    const exists = await Bank.findOne({ bankName, user: userId });
    if (exists) {
      res.status(400).json({ message: "Você já cadastrou este banco." });
      return;
    }

    const bank = new Bank({ bankName, currencyType, user: userId });
    await bank.save();

    res.status(201).json({
      message: "Banco cadastrado com sucesso.",
      bank: {
        id: bank._id,
        bankName: bank.bankName,
        currencyType: bank.currencyType,
      },
    });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao registrar o banco.", error: error.message });
    return;
  }
};

export const listBanks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const banks = await Bank.find({ user: userId }).sort("createdAt");
    res.json(banks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao buscar bancos.", error: error.message });
  }
};
