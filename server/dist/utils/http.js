export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}
export const asyncHandler = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
};
export const sanitizeString = (value, maxLength = 5000) => {
    if (typeof value !== "string")
        return "";
    return value.replace(/[<>]/g, "").trim().slice(0, maxLength);
};
export const parsePagination = (query) => {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 25), 1), 100);
    return { page, limit, skip: (page - 1) * limit };
};
