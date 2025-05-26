import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const COOKIE_NAME = "token";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res
      .status(401)
      .json({ message: "Não autorizado. Faça login e tente novamente." });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };
    req.userId = payload.id;
    req.userEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado." });
    return;
  }
};
