"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCheckAuth = exports.handleLogout = exports.handleLogin = exports.handleSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateTokenAndSetCookie = (res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
});
const handleSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.default.create({
            username,
            password: hashedPassword,
        });
        yield generateTokenAndSetCookie(res, user._id.toString());
        res.status(200).json({ message: "User created successfully", user });
    }
    catch (e) {
        const error = e;
        if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
            res.status(400).json({
                message: "Username has already been taken. Please try a different username",
            });
            return;
        }
        res.status(500).json({ message: "Server Error" });
        return;
    }
});
exports.handleSignup = handleSignup;
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const user = yield user_model_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ message: "Incorrect username or password" });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ message: "Incorrect username or password" });
            return;
        }
        yield generateTokenAndSetCookie(res, user._id.toString());
        res.status(200).json({ message: "User logged in successfully", user });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server Error" });
        return;
    }
});
exports.handleLogin = handleLogin;
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    }
    catch (e) {
        res.status(500).json({ message: "Server Error" });
        return;
    }
});
exports.handleLogout = handleLogout;
const handleCheckAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User is authenticated", user });
    }
    catch (e) {
        res.status(500).json({ message: "Server Error" });
        return;
    }
});
exports.handleCheckAuth = handleCheckAuth;
