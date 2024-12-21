"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const presettransaction_controller_1 = require("../controllers/presettransaction.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.post("/", verifyToken_1.verifyToken, presettransaction_controller_1.createPresetTransaction);
router.get("/:id", verifyToken_1.verifyToken, presettransaction_controller_1.getPresetTransactionById);
router.get("/", verifyToken_1.verifyToken, presettransaction_controller_1.getPresetTransactions);
router.put("/:id", verifyToken_1.verifyToken, presettransaction_controller_1.updatePresetTransaction);
router.delete("/:id", verifyToken_1.verifyToken, presettransaction_controller_1.deletePresetTransaction);
exports.default = router;
