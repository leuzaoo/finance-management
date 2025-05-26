import { Router, NextFunction, Request, Response } from "express";
import { validationResult, body } from "express-validator";

import { authenticate } from "../middlewares/authenticate";

import { addBank, listBanks } from "../controllers/bank.controller";

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
  "/",
  authenticate,
  [
    body("bankName")
      .isString()
      .withMessage("O nome do banco deve ser um texto.")
      .isLength({ min: 2 })
      .withMessage("Preencha o nome do banco."),
    body("currencyType").isString().withMessage("Selecione uma moeda."),
  ],
  validate,
  addBank
);

router.get("/", authenticate, listBanks);

export default router;
