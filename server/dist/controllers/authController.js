import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from "../config/env.js";
import { asyncHandler, sanitizeString } from "../utils/http.js";
const generateToken = (id) => {
    return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};
// Register user
// POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
    const name = sanitizeString(req.body.name, 120);
    const email = sanitizeString(req.body.email, 180).toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!name || !email || password.length < 8) {
        res.status(400).json({ message: "Name, valid email, and an 8+ character password are required" });
        return;
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: "User already exists" });
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString()) });
    }
    else {
        res.status(400).json({ message: "Invalid user data" });
    }
});
// Login user
// POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
    const email = sanitizeString(req.body.email, 180).toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString()) });
    }
    else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});
