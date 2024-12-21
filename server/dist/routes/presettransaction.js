"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../controllers/transaction.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.post("/", verifyToken_1.verifyToken, transaction_controller_1.createTransaction);
router.get("/:id", verifyToken_1.verifyToken, transaction_controller_1.getTransactionById);
router.get("/", verifyToken_1.verifyToken, transaction_controller_1.getTransactions);
router.put("/:id", verifyToken_1.verifyToken, transaction_controller_1.updateTransaction);
router.delete("/:id", verifyToken_1.verifyToken, transaction_controller_1.deleteTransaction);
exports.default = router;
