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
exports.deleteTransaction = exports.updateTransaction = exports.getTransactions = exports.getTransactionById = exports.createTransaction = void 0;
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
// Create
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { name, description, amount, type, date, account, category, vendor, tags, } = req.body;
        const newTransaction = new transaction_model_1.default({
            userId,
            name,
            description,
            amount,
            type,
            date,
            account,
            category,
            vendor,
            tags,
        });
        const savedTransaction = yield newTransaction.save();
        res.status(201).json(savedTransaction);
    }
    catch (err) {
        console.error("Error creating transaction:", err);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});
exports.createTransaction = createTransaction;
// ReadOne
const getTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const transaction = yield transaction_model_1.default.findOne({ _id: id, userId });
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
exports.getTransactionById = getTransactionById;
//Read
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const { q, limit = 100, sort = "-date", startDate, endDate, category, tag, type, minAmount, maxAmount, accounts, } = req.query;
        console.log(req.query);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // Build the query object
        const query = { userId };
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: "i" } }, // Replace 'field1' with the field you want to search
                { vendor: { $regex: q, $options: "i" } }, // Add more fields if needed
                { description: { $regex: q, $options: "i" } }, // Add more fields if needed
            ];
        }
        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = startDate;
            if (endDate)
                query.date.$lte = endDate;
        }
        // Category filter
        if (category) {
            query.category = category;
        }
        // Tags filter
        if (tag) {
            query.tags = {
                $in: tag,
            };
        }
        // Type filter
        if (type) {
            query.type = type;
        }
        // Amount range filter
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount)
                query.amount.$gte = Number(minAmount);
            if (maxAmount)
                query.amount.$lte = Number(maxAmount);
        }
        // Account filter
        if (accounts) {
            query.account = { $in: Array.isArray(accounts) ? accounts : [accounts] };
        }
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
exports.getTransactions = getTransactions;
// Update
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req;
        const updateData = req.body;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const transaction = yield transaction_model_1.default.findOne({ _id: id, userId });
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
exports.updateTransaction = updateTransaction;
// Delete
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const transaction = yield transaction_model_1.default.findOne({ _id: id, userId });
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
exports.deleteTransaction = deleteTransaction;
