import { Response } from "express";
import bcrypt from "bcrypt";

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

    res.json(user);
  } catch (err: any) {
    res.status(500).json({
      message: "Erro ao buscar perfil do usuário.",
      error: err.message,
    });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId!;
  const user = await User.findById(userId).select("name email");
  if (!user) res.status(404).json({ message: "Usuário não encontrado." });
  res.json(user);
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId!;
  const { firstName, password } = req.body;

  const update: any = {};
  if (firstName) update.firstName = firstName;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(password, salt);
  }

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
    select: "firstName email",
  });

  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  res.json(user);
};
