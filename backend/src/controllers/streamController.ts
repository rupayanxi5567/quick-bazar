import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient} from "@clerk/express";
import { getLocalUser } from "../lib/users.js";
import {
    getStreamChatServer,
    streamChatDisplayName,
    streamUserId,
} from "../lib/stream.js";
import { getEnv } from "../lib/env.js";

let env = getEnv();

export async function createStreamToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        let { userId, isAuthenticated } = getAuth(req);
        if (!userId || !isAuthenticated) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        let localUser = await getLocalUser(userId);
        if (!localUser) {
            res.status(503).json({ error: "Account not synced yet" });
            return;
        }
        let server = getStreamChatServer(env);
        let clerkUser = await clerkClient.users.getUser(userId);
        let combined =
            [clerkUser.firstName, clerkUser.lastName]
                .filter(Boolean)
                .join(" ") || null;
        let name = streamChatDisplayName(
            localUser.role,
            localUser.displayName ?? combined ?? clerkUser.username,
            localUser.email,
        );
        let image = clerkUser.imageUrl || undefined;
        let sid = streamUserId(userId);
        await server.upsertUser({ id: sid, name, image });
        let token = server.createToken(sid);
        res.json({ token, apiKey: env.STREAM_API_KEY, userId: sid });
    } catch (e) {
        next(e);
    }
}
