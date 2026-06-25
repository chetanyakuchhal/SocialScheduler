import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddlewware.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { asyncHandler, parsePagination } from "../utils/http.js";

// Get all activity
// GET /api/activity
export const getActivity = asyncHandler(async (req:AuthRequest, res: Response): Promise<void> => {
       const { limit } = parsePagination(req.query);
       const activity = await ActivityLog.find({user: req.user._id}).sort({createdAt: -1 }).limit(limit).populate("relatedPost", "content");
       res.json(activity)
})
