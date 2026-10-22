import { Router } from "express";
import { createCheckout } from "../controllers/checkoutController";

let router = Router();

router.post("/",createCheckout)

export default router;
