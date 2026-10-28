import { Router } from "express";
import { createAdminProduct, deleteAdminProduct, getImagekitAuth, listAdminProducts, requireAdmin, updateAdminProduct } from "../controllers/adminController";

let router = Router();

router.use(requireAdmin);

router.get("/imagekit/auth",getImagekitAuth);
router.get("/products",listAdminProducts);
router.post("/products",createAdminProduct);
router.patch("/products/:id",updateAdminProduct);
router.delete("/products/:id",deleteAdminProduct);

export default router;

