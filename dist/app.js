"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const bank_service_1 = require("./helper/bank.service");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const district_route_1 = __importDefault(require("./routes/district.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const products_route_1 = __importDefault(require("./routes/products.route"));
const transaction_route_1 = __importDefault(require("./routes/transaction.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const auth_helper_1 = require("./helper/auth.helper");
dotenv_1.default.config();
const app = (0, express_1.default)();
let JSONParser = body_parser_1.default.json();
let urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
app.use(JSONParser, urlencodedParser);
app.use(express_1.default.static('temp'));
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.use("/auth", auth_route_1.default);
app.use("/district", district_route_1.default);
app.use("/post", post_route_1.default);
app.use("/comment", auth_helper_1.authMiddleware, comment_route_1.default);
app.use("/product", products_route_1.default);
app.use('/transaction', transaction_route_1.default);
app.use('/payment', payment_route_1.default);
app.listen(port, () => {
    console.log(`[server] Server is running at https://localhost:${port}`);
    // Referesh Banking token
    bank_service_1.BRI_service.scheduleRefreshBRIToken();
});
