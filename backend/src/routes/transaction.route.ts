import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { body, param, query, validationResult } from "express-validator";

import { authenticate } from "../middlewares/authenticate";

import {
  addTransaction,
  deleteTransaction,
  listTransactions,
} from "../controllers/transaction.controller";

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
  "/:bankId/add",
  authenticate,
  param("bankId").isMongoId().withMessage("BankId inválido"),
  body("type")
    .isIn(["expense", "income"])
    .withMessage("O tipo deve ser 'Entrada' ou 'Saída'."),
  body("amount").isNumeric().withMessage("Valor deve ser numérico."),
  body("category").isString().withMessage("Categoria é obrigatório."),
  body("description").optional().isString(),
  body("date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date deve ser ISO8601."),
  validate,
  addTransaction
);

router.get(
  "/:bankId/history",
  authenticate,
  param("bankId").isMongoId().withMessage("BankId inválido"),
  query("from").optional().isISO8601().toDate(),
  query("to").optional().isISO8601().toDate(),
  validate,
  listTransactions
);

router.delete(
  "/:bankId/:txId",
  authenticate,
  param("bankId").isMongoId().withMessage("BankId inválido"),
  param("txId").isMongoId().withMessage("Transaction ID inválido"),
  validate,
  deleteTransaction
);
export default router;
