import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";

import { addSubscription } from "../controllers/subscription.controller";

const router = Router();

router.post("/:bankId/add", authenticate, addSubscription);

export default router;
