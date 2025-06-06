import type { Response } from "express";
import mongoose from "mongoose";

import type { AuthRequest } from "../middlewares/authenticate";

import Subscription from "../models/Subscription";
import Bank from "../models/Bank";

export const addSubscription = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { bankId } = req.params;
    const { platform, amount } = req.body;

    if (!platform || typeof platform !== "string") {
      res
        .status(400)
        .json({ message: "Campo 'platform' é obrigatório e deve ser string." });
      return;
    }
    if (amount == null || isNaN(Number(amount))) {
      res
        .status(400)
        .json({ message: "Campo 'amount' é obrigatório e deve ser numérico." });
      return;
    }

    const bank = await Bank.findOne({ _id: bankId, user: req.userId });
    if (!bank) {
      res.status(404).json({ message: "Banco não encontrado." });
      return;
    }

    const sub = await Subscription.create({
      bank: new mongoose.Types.ObjectId(bankId),
      platform: platform.trim(),
      amount: Number(amount),
    });

    res.status(201).json(sub);
    return;
  } catch (error: any) {
    console.error("addSubscription error:", error);
    res
      .status(500)
      .json({ message: "Erro ao criar inscrição", error: error.message });
    return;
  }
};
