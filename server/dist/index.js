"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const presettransaction_routes_1 = __importDefault(require("./routes/presettransaction.routes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/user", user_routes_1.default);
app.use("/auth", auth_routes_1.default);
// Routes
app.use("/transactions", transaction_routes_1.default);
app.use("/preset-transactions", presettransaction_routes_1.default);
mongoose_1.default.connect(`mongodb+srv://deantowheed5:${process.env.DB_PASS}@cluster0.ewv8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
});
app.get("/", (req, res) => {
    res.send("Welcome to the MeRN server!");
});
