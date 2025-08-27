import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { body, validationResult } from "express-validator";

import { authenticate } from "../middlewares/authenticate";
import {
  getMe,
  getProfile,
  updateProfile,
} from "../controllers/user.controller";

import User, { allowedCurrencies } from "../models/User";

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
    body("firstName")
      .optional()
      .isString()
      .withMessage("Nome inválido.")
      .isLength({ min: 2 })
      .withMessage("Nome não pode ser vazio."),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Senha deve ter ao menos 6 caracteres."),
  ],
  validate,
  updateProfile
);

router.patch(
  "/me/primary-currency",
  [
    body("primaryCurrency")
      .isString()
      .toUpperCase()
      .isIn(allowedCurrencies as unknown as string[])
      .withMessage(`Moeda inválida. Use: ${allowedCurrencies.join(", ")}`),
  ],
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
  async (req: any, res: Response): Promise<void> => {
    try {
      const pc = String(req.body.primaryCurrency).toUpperCase();

      const userId =
        req.user?.id || req.user?._id?.toString?.() || req.userId || null;

      if (!userId) {
        console.error(
          "[primary-currency] userId ausente no req.user",
          req.user
        );
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const updated = await User.findByIdAndUpdate(
        userId,
        { primaryCurrency: pc },
        { new: true, runValidators: true } // valida enum no schema
      ).select("firstName email primaryCurrency");

      if (!updated) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.json({
        message: "Moeda principal atualizada.",
        user: {
          id: updated._id,
          firstName: updated.firstName,
          email: updated.email,
          primaryCurrency: updated.primaryCurrency,
        },
      });
    } catch (e: any) {
      console.error("[primary-currency] erro:", e);
      res.status(500).json({
        message: "Erro ao atualizar moeda principal.",
        error: e?.message,
      });
      return;
    }
  }
);

export default router;
