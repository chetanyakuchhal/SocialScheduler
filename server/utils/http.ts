import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const asyncHandler =
    <TReq extends Request = Request>(handler: (req: TReq, res: Response, next: NextFunction) => Promise<void>) =>
    (req: TReq, res: Response, next: NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };

export const sanitizeString = (value: unknown, maxLength = 5000) => {
    if (typeof value !== "string") return "";
    return value.replace(/[<>]/g, "").trim().slice(0, maxLength);
};

export const parsePagination = (query: Request["query"]) => {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 25), 1), 100);
    return { page, limit, skip: (page - 1) * limit };
};
