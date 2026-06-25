const optionalEnv = (key: string, fallback = "") => process.env[key] || fallback;

const requiredInProduction = [
    "MONGODB_URI",
    "JWT_SECRET",
    "CLIENT_URL",
];

export const env = {
    nodeEnv: optionalEnv("NODE_ENV", "development"),
    port: Number(optionalEnv("PORT", "3000")),
    mongoUri: optionalEnv("MONGODB_URI"),
    jwtSecret: optionalEnv("JWT_SECRET", "dev_only_change_me"),
    jwtExpiresIn: optionalEnv("JWT_EXPIRES_IN", "7d"),
    clientUrl: optionalEnv("CLIENT_URL", "http://localhost:5173"),
    clientUrls: optionalEnv("CLIENT_URLS"),
    geminiApiKey: optionalEnv("GEMINI_API_KEY"),
    imageProvider: optionalEnv("IMAGE_PROVIDER", "pollinations"),
    huggingFaceToken: optionalEnv("HUGGINGFACE_API_TOKEN"),
    huggingFaceImageModel: optionalEnv("HUGGINGFACE_IMAGE_MODEL", "stabilityai/stable-diffusion-xl-base-1.0"),
    pollinationsBaseUrl: optionalEnv("POLLINATIONS_BASE_URL", "https://image.pollinations.ai"),
    zernioApiKey: optionalEnv("ZERNIO_API_KEY"),
    cloudinaryCloudName: optionalEnv("CLOUDINARY_CLOUD_NAME"),
    cloudinaryApiKey: optionalEnv("CLOUDINARY_API_KEY"),
    cloudinaryApiSecret: optionalEnv("CLOUDINARY_API_SECRET"),
};

export const validateEnv = () => {
    if (!env.mongoUri) {
        throw new Error("MONGODB_URI is required");
    }

    if (env.nodeEnv === "production") {
        const missing = requiredInProduction.filter((key) => !process.env[key]);
        if (missing.length > 0) {
            throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
        }
        if (env.jwtSecret === "dev_only_change_me") {
            throw new Error("JWT_SECRET must be changed in production");
        }
    }
};

export const allowedOrigins = () => {
    const configured = env.clientUrls || env.clientUrl;
    return configured
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
};
