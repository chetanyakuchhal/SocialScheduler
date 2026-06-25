import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
            cb(null, true);
            return;
        }
        cb(new Error("Only image and video uploads are supported"));
    },
});
