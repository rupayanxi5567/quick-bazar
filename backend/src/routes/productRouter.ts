import { Router } from "express";
import { listProducts } from "../controllers/productController";
import { getCategories } from "../controllers/productController";
import { getProductsBySlug } from "../controllers/productController";

let router = Router();

router.get("/", listProducts);
router.get("/categories", getCategories);
router.get("/:slug", getProductsBySlug);

export default router;
