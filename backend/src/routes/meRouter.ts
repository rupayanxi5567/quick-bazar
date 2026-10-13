import { getAuth } from "@clerk/express";
import { Router } from "express";
import { getLocalUser } from "../lib/users";

let router = Router();

router.get("/", async (req, res, next) => {
    try {
        let { userId, isAuthenticated } = getAuth(req);

        if (!isAuthenticated || !userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        let user = await getLocalUser(userId);
        res.json({ user });
    } catch (e) {
        next(e);
    }
});

export default router;
