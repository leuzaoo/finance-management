import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "Email já cadastrado" });
      return;
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "Usuário criado com sucesso" });
    return;
  } catch (err: any) {
    res.status(500).json({ message: "Erro no registro", error: err.message });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = (await User.findOne({ email })) as IUser;
    if (!user) {
      res.status(400).json({ message: "Credenciais inválidas" });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Credenciais inválidas" });
      return;
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
    return;
  } catch (err: any) {
    res.status(500).json({ message: "Erro no login", error: err.message });
    return;
  }
};
