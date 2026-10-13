import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { products } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function listProducts(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        let cat =
            typeof req.query.category === "string"
                ? req.query.category.trim()
                : "";

        let activeOnly = eq(products.active, true);
        let whereClause = cat
            ? and(activeOnly, eq(products.category, cat))
            : activeOnly;

        let rows = await db
            .select()
            .from(products)
            .where(whereClause)
            .orderBy(desc(products.createdAt));

        res.json({ products: rows });
    } catch (e) {
        next(e);
    }
}

export async function getCategories(
    _: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        let rows = await db
            .select({ category: products.category })
            .from(products)
            .where(eq(products.active, true));

        let categories = [...new Set(rows.map((r) => r.category))].sort(
            (a, b) => a.localeCompare(b),
        );
        res.json({ categories });
    } catch (e) {
        next(e);
    }
}

export async function getProductsBySlug(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        let [row] = await db
            .select()
            .from(products)
            .where(eq(products.slug, req.params.slug as string))
            .limit(1);
        if (!row || !row.active) {
            return res.status(404).json({ error: "Not Found" });
        }
        res.json({ product: row });
    } catch (e) {
        next(e);
    }
}
