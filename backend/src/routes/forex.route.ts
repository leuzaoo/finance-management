import { Router, type Request, type Response } from "express";
import { getRatesToBase } from "../lib/forex";

const router = Router();

router.get("/latest", async (req: Request, res: Response) => {
  const base = String(req.query.base || "BRL").toUpperCase();
  try {
    const data = await getRatesToBase(base);
    res.json(data);
  } catch (e) {
    console.error("forex/latest error:", e);
    res.status(502).json({ message: "Falha ao obter cotações de referência." });
  }
});

// todo
/**
 * (Opcional) GET /api/v1/forex/latest-for-user
 * Usa a moeda principal do usuário autenticado.
 */
// router.get("/latest-for-user", requireAuth, async (req: any, res: Response) => {
//   const base = (req.user?.primaryCurrency || "BRL").toUpperCase();
//   try {
//     const data = await getRatesToBase(base);
//     res.json(data);
//   } catch (e) {
//     console.error("forex/latest-for-user error:", e);
//     res.status(502).json({ message: "Falha ao obter cotações de referência." });
//   }
// });

export default router;
