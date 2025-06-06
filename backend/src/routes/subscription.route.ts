import { param, validationResult } from "express-validator";
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

router.post("/:bankId/add", authenticate, addSubscription);

router.get("/:bankId", authenticate, listSubscriptions);

router.delete(
  "/:bankId/:subId",
  authenticate,
  param("bankId").isMongoId().withMessage("O 'bankId' está inválido."),
  param("subId").isMongoId().withMessage("O 'subId' está inválido."),
  validate,
  deleteSubscription
);
export default router;
