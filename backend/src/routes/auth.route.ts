import { Router, NextFunction, Request, Response } from "express";
import { validationResult, body } from "express-validator";

import { register, login, logout } from "../controllers/auth.controller";

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

router.post(
  "/register",
  [
    body("firstName")
      .isString()
      .withMessage("Preencha um nome de usuário.")
      .isLength({ min: 2 })
      .withMessage("Nome deve conter no mínimo 2 caracteres"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("A senha deve ter ao menos 6 caracteres"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  validate,
  login
);

router.post("/logout", logout);

export default router;
