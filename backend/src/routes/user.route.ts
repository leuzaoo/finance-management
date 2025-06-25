import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { authenticate } from "../middlewares/authenticate";

import {
  getMe,
  getProfile,
  updateProfile,
} from "../controllers/user.controller";
import { body, validationResult } from "express-validator";

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

router.use(authenticate);

router.get("/profile", getProfile);
router.get("/me", getMe);

router.put(
  "/me",
  [
    body("name").optional().isString().withMessage("Nome inválido."),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Senha deve ter ao menos 6 caracteres."),
  ],
  validate,
  updateProfile
);

export default router;
