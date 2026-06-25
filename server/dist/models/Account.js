import mongoose from "mongoose";
const accountSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: { type: String, enum: ["twitter", "linkedin", "facebook", "instagram", "facebook_page", "linkedin_page", "instagram_business"], required: true },
    handle: { type: String, required: true },
    zernioAccountId: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiresAt: { type: Date },
    status: { type: String, enum: ["connected", "disconnected"], default: "connected" },
    avatarUrl: { type: String },
}, { timestamps: true });
accountSchema.index({ user: 1, platform: 1 });
accountSchema.index({ zernioAccountId: 1 }, { unique: true, sparse: true });
export const Account = mongoose.model("Account", accountSchema);
