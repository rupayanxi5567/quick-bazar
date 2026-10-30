import { Router } from "express";
import { createStreamChannel, createVideoInvite, getOrders, listOrders } from "../controllers/orderController";

let router = Router();

router.get("/", listOrders);
router.get("/:id", getOrders);
router.post("/:id/stream-channel", createStreamChannel);
router.post("/:id/video-invite", createVideoInvite);

export default router;
