import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { clearAuthCookie, setAuthCookie } from "../utils/cookies";
import User, { IUser } from "../models/User";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "Email já cadastrado" });
      return;
    }

    const user = new User({ firstName, email, password });
    await user.save();

    if (!JWT_SECRET) {
      console.error("The variable JWT_SECRET was not defined.");
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    setAuthCookie(res, token);

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
      token,
    });
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

    setAuthCookie(res, token).json({ message: "Login realizado com sucesso." });
    return;
  } catch (err: any) {
    res.status(500).json({ message: "Erro no login", error: err.message });
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    clearAuthCookie(res).json({ success: true, message: "Logout realizado." });
    return;
  } catch (error: any) {
    console.log("Erro no controlador de logout: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
