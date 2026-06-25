import { NextFunction, Request, Response } from "express";

const buckets = new Map<string, { count: number; resetAt: number }>();

export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
};

export const rateLimit = (limit = 120, windowMs = 15 * 60 * 1000) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.ip || req.socket.remoteAddress || "unknown";
        const now = Date.now();
        const bucket = buckets.get(key);

        if (!bucket || bucket.resetAt < now) {
            buckets.set(key, { count: 1, resetAt: now + windowMs });
            next();
            return;
        }

        bucket.count += 1;
        if (bucket.count > limit) {
            res.status(429).json({ message: "Too many requests. Please try again shortly." });
            return;
        }

        next();
    };
};
