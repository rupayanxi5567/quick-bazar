import { Router } from "express";
import { createStreamToken } from "../controllers/streamController";

let router = Router();

router.post("/token",createStreamToken);

export default router;