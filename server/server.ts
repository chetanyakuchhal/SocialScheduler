import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import { env, validateEnv } from "./config/env.js";
import authRouter from "./routes/authRoutes.js";
import socialAuthRouter from "./routes/socialAuthRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import postRouter from "./routes/postRoutes.js";
import activityRouter from "./routes/activityRoutes.js";
import { initScheduler } from "./services/schedulerService.js";
import { rateLimit, securityHeaders } from "./middlewares/security.js";

const app = express();
validateEnv();

// Database connection
await connectDB()

// Middleware
app.use(securityHeaders);
app.use(rateLimit());
app.use(cors({
    origin: env.nodeEnv === "production" ? env.clientUrl : true,
    credentials: true,
}))
app.use(express.json({ limit: "1mb" }));

const port = env.port;

app.get('/', (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "Social Scheduler API" });
});

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/oauth", socialAuthRouter)
app.use("/api/v1/accounts", accountRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/activity", activityRouter)
app.use("/api/auth", authRouter)
app.use("/api/oauth", socialAuthRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/posts", postRouter)
app.use("/api/activity", activityRouter)

// Initialize Scheduler
initScheduler()

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction)=>{
    console.error(err);
    const statusCode = err?.statusCode || 500;
    res.status(statusCode).json({
        message: err?.response?.data?.message || err?.message || "Server error",
    })
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
