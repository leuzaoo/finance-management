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

export const listSubscriptions = async (
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

    const subs = await Subscription.find().lean();

    res.json(subs);
    return;
  } catch (error: any) {
    console.error("listSubscriptions error:", error);
    res.status(500).json({
      message: "Erro ao buscar a lista de assinaturas: ",
      error: error.message,
    });
    return;
  }
};

export const updateSubscription = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { bankId, subId } = req.params;
    const { platform, amount } = req.body;

    const bank = await Bank.findOne({ _id: bankId, user: req.userId });

    if (!bank) {
      res.status(404).json({ message: "Banco não encontrado." });
      return;
    }

    const sub = await Subscription.findOne({ _id: subId, bank: bankId });
    if (!sub) {
      res.status(404).json({ message: "Assinatura não encontrada." });
      return;
    }

    if (platform !== undefined) {
      sub.platform = platform.trim();
    }

    if (amount !== undefined) {
      sub.amount = Number(amount);
    }

    await sub.save();

    res.status(200).json(sub);

    return;
  } catch (error: any) {
    console.error("updateSubscription error:", error);
    res
      .status(500)
      .json({ message: "Erro ao atualizar assinatura", error: error.message });
    return;
  }
};

export const deleteSubscription = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { bankId, subId } = req.params;

    const bank = await Bank.findOne({ _id: bankId, user: req.userId });
    if (!bank) {
      res.status(404).json({ message: "Banco não encontrado." });
      return;
    }

    const sub = await Subscription.findOne({ _id: subId, bank: bankId });
    if (!sub) {
      res.status(404).json({ message: "Assinatura não encontrada." });
      return;
    }

    await sub.save();
    await Subscription.deleteOne({ _id: subId });

    res.status(200).json({ message: "Assinatura deletada com sucesso." });
    return;
  } catch (error: any) {
    console.error("deleteSubscription error:", error);
    res
      .status(500)
      .json({ message: "Erro ao deletar assinatura.", error: error.message });
    return;
  }
};
