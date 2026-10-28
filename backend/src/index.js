import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express'
import { startKeepAlive } from './lib/cron.js';
import fs from 'fs';
import path from 'path';
import clerkWebhook from './webhooks/clerk.webhook.js';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { server, app } from './lib/socket.js';


const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;
const publicDir = path.join(process.cwd(), "public");

// it's important that you don't parse the webhook event data, it should be in the raw format
app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);

app.use(express.json())
app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(clerkMiddleware({ telemetry: { disabled: true } }));

app.use("/api/auth", authRoutes);
app.use('/api/messages', messageRoutes)

app.get("/health", (_req, res) => res.json({ ok: true }));

if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get("/{*any}", (req, res, next) => {
        res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
    })
}

server.listen(PORT, () => {
    connectDB();
    console.log("Server is listening on PORT:", PORT);

    // In dev, FRONTEND_URL points at Vite, so only ping the deployed service.
    if (process.env.NODE_ENV === "production") {
        startKeepAlive();
    }
})