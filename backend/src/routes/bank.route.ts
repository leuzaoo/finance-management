import { Router, NextFunction, Request, Response } from "express";
import { validationResult, body } from "express-validator";

import { authenticate } from "../middlewares/authenticate";

import {
  addBank,
  listBanks,
  updateBankValue,
} from "../controllers/bank.controller";

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
      .withMessage("O nome do banco deve ser texto.")
      .isLength({ min: 2 })
      .withMessage("Precisa ter ao menos 2 caracteres."),
    body("currencyType").isString().withMessage("Selecione uma moeda válida."),
    body("currencyValue")
      .optional()
      .isNumeric()
      .withMessage("O valor inicial deve ser numérico."),
  ],
  validate,
  addBank
);

router.put(
  "/:bankId/value",
  authenticate,
  [body("currencyValue").isNumeric().withMessage("O valor deve ser numérico.")],
  validate,
  updateBankValue
);

router.get("/", authenticate, listBanks);

export default router;
