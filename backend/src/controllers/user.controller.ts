import { Response } from "express";

import { AuthRequest } from "../middlewares/authenticate";

import User from "../models/User";

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const user = await User.findById(userId)
      .select("-password -__v")
      .populate({
        path: "banks",
        select: "bankName currencyType createdAt",
      })
      .lean();

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    res.json({ user });
  } catch (err: any) {
    res.status(500).json({
      message: "Erro ao buscar perfil do usuário.",
      error: err.message,
    });
  }
};
