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
exports.deletePresetTransaction = exports.updatePresetTransaction = exports.getPresetTransactions = exports.getPresetTransactionById = exports.createPresetTransaction = void 0;
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
// Create
const createPresetTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // Count existing transactions for the user
        const transactionCount = yield transaction_model_1.default.countDocuments({
            userId,
        });
        if (transactionCount >= 100) {
            res.status(400).json({
                error: "Preset Transaction limit reached (100). Please delete an existing preset transaction and try again",
            });
            return;
        }
        const { name, description, amount, type, date, account, category, vendor } = req.body;
        const newTransaction = new transaction_model_1.default({
            name,
            description,
            amount,
            type,
            date,
            account,
            category,
            vendor,
            userId,
        });
        const savedTransaction = yield newTransaction.save();
        res.status(201).json(savedTransaction);
    }
    catch (err) {
        console.error("Error creating transaction:", err);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});
exports.createPresetTransaction = createPresetTransaction;
// ReadOne
const getPresetTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const transaction = yield transaction_model_1.default.findOne({
            _id: id,
            userId,
        });
        if (!transaction) {
            res.status(404).json({ error: "Transaction not found or unauthorized" });
            return;
        }
        res.json(transaction);
    }
    catch (err) {
        console.error("Error fetching transaction:", err);
        res.status(500).json({ error: "Failed to fetch transaction" });
    }
});
exports.getPresetTransactionById = getPresetTransactionById;
//Read
const getPresetTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const { limit = 100, sort = "-name" } = req.query;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // Query object with only userId
        const query = { userId };
        const transactions = yield transaction_model_1.default.find(query)
            .sort(sort)
            .limit(Number(limit));
        res.json(transactions);
    }
    catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
exports.getPresetTransactions = getPresetTransactions;
// Update
const updatePresetTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req;
        const updateData = req.body;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const transaction = yield transaction_model_1.default.findOne({
            _id: id,
            userId,
        });
        if (!transaction) {
            res
                .status(403)
                .json({ error: "You are not authorized to update this transaction" });
            return;
        }
        const updatedTransaction = yield transaction_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedTransaction);
    }
    catch (err) {
        console.error("Error updating transaction:", err);
        res.status(500).json({ error: "Failed to update transaction" });
    }
});
exports.updatePresetTransaction = updatePresetTransaction;
// Delete
const deletePresetTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const transaction = yield transaction_model_1.default.findOne({
            _id: id,
            userId,
        });
        if (!transaction) {
            res
                .status(403)
                .json({ error: "You are not authorized to delete this transaction" });
            return;
        }
        yield transaction_model_1.default.findByIdAndDelete(id);
        res.json({ message: "Transaction deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting transaction:", err);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});
exports.deletePresetTransaction = deletePresetTransaction;
