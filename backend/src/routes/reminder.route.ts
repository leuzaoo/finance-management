import { Router, Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";

import { authenticate } from "../middlewares/authenticate";
import {
  listReminders,
  addReminder,
  updateReminder,
  deleteReminder,
} from "../controllers/reminder.controller";

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(authenticate);

router.get("/", listReminders);

router.post(
  "/",
  authenticate,
  body("title")
    .isString()
    .withMessage("Título deve ser texto.")
    .notEmpty()
    .withMessage("Título é obrigatório."),
  body("description").optional().isString(),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Data deve ser ISO8601.")
    .toDate(),
  (req: Request, res: Response, next: NextFunction): void => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      res.status(400).json({ errors: errs.array() });
    }
    next();
  },
  addReminder
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("ID inválido."),
    body("title").optional().isString().withMessage("Título deve ser texto."),
    body("description")
      .optional()
      .isString()
      .withMessage("Descrição deve ser texto."),
    body("date").optional().isISO8601().withMessage("Data inválida.").toDate(),
  ],
  validate,
  updateReminder
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("ID inválido.")],
  validate,
  deleteReminder
);

export default router;
