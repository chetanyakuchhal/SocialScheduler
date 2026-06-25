import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddlewware.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
import { asyncHandler, sanitizeString } from "../utils/http.js";

const supportedPlatforms = ["twitter", "linkedin", "facebook", "instagram", "facebook_page", "linkedin_page", "instagram_business"] as const;

// Get all accounts
// GET /api/accounts
export const getAccounts = asyncHandler(async (req: AuthRequest, res: Response) : Promise<void> =>{
    const accounts = await Account.find({user: req.user._id }).sort({createdAt: -1})
    res.json(accounts)
})

// Add account
// POST /api/accounts
export const addAccount = asyncHandler(async (req: AuthRequest, res: Response) : Promise<void> =>{
    const platform = sanitizeString(req.body.platform, 80);
    const handle = sanitizeString(req.body.handle, 120);
    const avatarUrl = sanitizeString(req.body.avatarUrl, 1000);

    if(!supportedPlatforms.includes(platform as typeof supportedPlatforms[number]) || !handle){
        res.status(400).json({ message: "A supported platform and handle are required" });
        return;
    }
    const accountPlatform = platform as typeof supportedPlatforms[number];

    const account = await Account.create({user: req.user._id, platform: accountPlatform, handle, avatarUrl });
    res.status(201).json(account)
})

// Disconnect account
// DELETE /api/accounts/:id
export const disconnectAccount = asyncHandler(async (req: AuthRequest, res: Response) : Promise<void> =>{
        const account = await Account.findOne({_id: req.params.id, user: req.user._id});
        if(!account){
            res.status(404).json({ message: "Account not found" });
            return;
        }
        if(account.zernioAccountId){
            try {
                await zernio.accounts.deleteAccount({path: {accountId: account.zernioAccountId}})
            } catch (error: any) {
                 res.status(500).json({ message: error?.response?.data?.message || error?.message });
                 return
            }
        }
        await account.deleteOne()
        res.json({ message: "Account disconnected successfully" })
})
