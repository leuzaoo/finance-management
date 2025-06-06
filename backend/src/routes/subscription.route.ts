import { body, param, validationResult } from "express-validator";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { authenticate } from "../middlewares/authenticate";

import {
  addSubscription,
  deleteSubscription,
  listSubscriptions,
  updateSubscription,
} from "../controllers/subscription.controller";

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
  param("bankId").isMongoId().withMessage("O 'bankId' está inválido."),
  body("platform")
    .exists()
    .withMessage("Campo 'platform' é obrigatório.")
    .bail()
    .isString()
    .withMessage("'platform' deve ser texto."),
  body("amount")
    .exists()
    .withMessage("Campo 'amount' é obrigatório.")
    .bail()
    .isNumeric()
    .withMessage("'amount' deve ser numérico."),
  validate,
  addSubscription
);

router.get(
  "/:bankId",
  authenticate,
  param("bankId").isMongoId().withMessage("O 'bankId' está inválido."),
  validate,
  listSubscriptions
);

router.put(
  "/:bankId/:subId",
  authenticate,
  param("bankId").isMongoId().withMessage("O 'bankId' está inválido."),
  param("subId").isMongoId().withMessage("O 'subId' está inválido."),
  body("platform")
    .optional()
    .isString()
    .withMessage("'platform' deve ser texto válido se fornecido."),
  body("amount")
    .optional()
    .isNumeric()
    .withMessage("'amount' deve ser numérico se fornecido."),
  validate,
  updateSubscription
);

router.delete(
  "/:bankId/:subId",
  authenticate,
  param("bankId").isMongoId().withMessage("O 'bankId' está inválido."),
  param("subId").isMongoId().withMessage("O 'subId' está inválido."),
  validate,
  deleteSubscription
);

export default router;
