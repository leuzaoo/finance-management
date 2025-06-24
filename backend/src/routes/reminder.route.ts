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
  [
    body("title")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Título é obrigatório."),
    body("message").optional().isString(),
    body("remindAt").isISO8601().toDate().withMessage("Data inválida."),
  ],
  validate,
  addReminder
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("ID inválido."),
    body("title")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Título é obrigatório."),
    body("message").optional().isString(),
    body("remindAt").isISO8601().toDate().withMessage("Data inválida."),
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
