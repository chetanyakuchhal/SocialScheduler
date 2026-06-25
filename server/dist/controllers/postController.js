import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";
import { asyncHandler, parsePagination, sanitizeString } from "../utils/http.js";
import { generatePostCopy } from "../services/textGenerationService.js";
import { getImageProvider } from "../services/imageProviders.js";
// Generate post
// POST /api/posts/generate
export const generatePost = asyncHandler(async (req, res) => {
    const prompt = sanitizeString(req.body.prompt, 1000);
    const tone = sanitizeString(req.body.tone, 80) || "Professional";
    const generateImage = Boolean(req.body.generateImage);
    if (!prompt) {
        res.status(400).json({ message: "Prompt is required" });
        return;
    }
    const { content, imagePrompt } = await generatePostCopy(prompt, tone);
    let mediaUrl = "";
    if (generateImage) {
        try {
            mediaUrl = await getImageProvider().generate(imagePrompt);
        }
        catch (err) {
            console.error("Image generation failed:", err);
        }
    }
    // Save generation to DB
    const generation = await Generation.create({
        user: req.user._id,
        prompt,
        content,
        mediaUrl,
        mediaType: mediaUrl ? "image" : undefined,
        tone
    });
    res.json(generation);
});
// Get generations
// GET /api/posts/generations
export const getGenerations = asyncHandler(async (req, res) => {
    const { limit } = parsePagination(req.query);
    const generations = await Generation.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(limit);
    res.json(generations);
});
// Get posts
// GET /api/posts
export const getPosts = asyncHandler(async (req, res) => {
    const { limit } = parsePagination(req.query);
    const filter = { user: req.user._id };
    if (typeof req.query.status === "string")
        filter.status = req.query.status;
    if (typeof req.query.search === "string" && req.query.search.trim()) {
        filter.content = { $regex: sanitizeString(req.query.search, 120), $options: "i" };
    }
    const posts = await Post.find(filter).sort({ scheduledFor: 1 }).limit(limit);
    res.json(posts);
});
// Schedule post
// POST /api/posts
export const schedulePost = asyncHandler(async (req, res) => {
    const content = sanitizeString(req.body.content, 2200);
    const { platforms, scheduledFor } = req.body;
    const status = ["draft", "scheduled"].includes(req.body.status) ? req.body.status : "scheduled";
    // Parse platforms if it comes as a stringified array from FormData
    let parsedPlatforms = platforms;
    if (typeof platforms === "string") {
        try {
            parsedPlatforms = JSON.parse(platforms);
        }
        catch (e) {
            parsedPlatforms = platforms.split(",");
        }
    }
    if (!content || !scheduledFor) {
        res.status(400).json({ message: "Content and scheduled date are required" });
        return;
    }
    if (!Array.isArray(parsedPlatforms) || parsedPlatforms.length === 0) {
        res.status(400).json({ message: "Select at least one platform" });
        return;
    }
    let mediaUrl = sanitizeString(req.body.mediaUrl, 1000) || undefined;
    let mediaType = ["image", "video"].includes(req.body.mediaType) ? req.body.mediaType : undefined;
    if (req.file) {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ resource_type: "auto", folder: "social-scheduler" }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end(req.file.buffer);
        });
        mediaUrl = result.secure_url;
        mediaType = result.resource_type === "video" ? "video" : "image";
    }
    const post = await Post.create({
        user: req.user._id,
        content,
        platforms: parsedPlatforms,
        mediaUrl,
        mediaType,
        scheduledFor,
        status,
    });
    res.status(201).json(post);
});
