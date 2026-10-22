import "dotenv/config";
import express from "express";
import cors from "cors";

import fs from "node:fs";
import path from "node:path";

// import * as Sentry from "@sentry/node";

import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { getEnv } from "./lib/env";
import keepAliveCron from "./lib/cron";

import productRouter from "./routes/productRouter";
import meRouter from "./routes/meRouter";
import streamRouter from "./routes/streamRouter";
import chekoutRouter from "./routes/chekoutRouter";
// import adminRouter from "./routes/adminRouter";
// import orderRouter from "./routes/orderRouter";

// import { polarWebhookHandler } from "./webhooks/polar";
// import { sentryClerkUserMiddleware } from "./middleware/sentryClerkUser";

let env = getEnv();

const app = express();

let rawJson = express.raw({ type: "application/json", limit: "1mb" });

app.post("/webhooks/clerk", rawJson, (req, res) => {
    void clerkWebhookHandler(req, res);
});

// app.post("/webhooks/polar", rawJson, (req, res) => {
//     void polarWebhookHandler(req, res);
// });

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/health", (_, res) => {
    res.json({ ok: true });
});

app.use("/api/me",meRouter);
app.use("/api/products",productRouter);
app.use("/api/stream",streamRouter);
app.use("/api/checkout",chekoutRouter);

let publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get("/{*splat}", (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
            next();
            return;
        }

        if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
            next();
            return;
        }

        res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
    });
}

app.listen(env.PORT, () => {
    console.log(`SERVER IS RUNNING ON http://localhost:${env.PORT}`);

    if (env.NODE_ENV === "production") {
        keepAliveCron.start();
    }
});
