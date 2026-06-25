import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";
const uploadRemoteImage = async (imageUrl) => {
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: "ai-generations",
        resource_type: "image",
    });
    return uploadResult.secure_url;
};
const pollinationsProvider = {
    name: "pollinations",
    async generate(prompt) {
        const url = new URL("/prompt/" + encodeURIComponent(prompt), env.pollinationsBaseUrl);
        url.searchParams.set("width", "1024");
        url.searchParams.set("height", "1024");
        url.searchParams.set("nologo", "true");
        url.searchParams.set("enhance", "true");
        return uploadRemoteImage(url.toString());
    },
};
const huggingFaceProvider = {
    name: "huggingface",
    async generate(prompt) {
        if (!env.huggingFaceToken) {
            throw new Error("HUGGINGFACE_API_TOKEN is required for the Hugging Face image provider");
        }
        const response = await fetch(`https://api-inference.huggingface.co/models/${env.huggingFaceImageModel}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.huggingFaceToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Hugging Face image generation failed: ${message}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const uploadResult = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, {
            folder: "ai-generations",
            resource_type: "image",
        });
        return uploadResult.secure_url;
    },
};
export const getImageProvider = () => {
    if (env.imageProvider === "huggingface")
        return huggingFaceProvider;
    return pollinationsProvider;
};
