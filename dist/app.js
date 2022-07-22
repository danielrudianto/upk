"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
// import { BRI_service } from './helper/bank.service';
// import { initializeApp } from 'firebase-admin/app';
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const district_route_1 = __importDefault(require("./routes/district.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const products_route_1 = __importDefault(require("./routes/products.route"));
const transaction_route_1 = __importDefault(require("./routes/transaction.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const management_route_1 = __importDefault(require("./routes/management.route"));
const subscription_route_1 = __importDefault(require("./routes/subscription.route"));
const auth_helper_1 = __importDefault(require("./helper/auth.helper"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const social_media_route_1 = __importDefault(require("./routes/social_media.route"));
const report_route_1 = __importDefault(require("./routes/report.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
let JSONParser = body_parser_1.default.json();
let urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
app.use(JSONParser, urlencodedParser);
app.use('/public', express_1.default.static(__dirname + '/public'));
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.use("/auth", auth_route_1.default);
app.use("/district", district_route_1.default);
app.use("/post", auth_helper_1.default.authMiddleware, post_route_1.default);
app.use("/comment", auth_helper_1.default.authMiddleware, comment_route_1.default);
app.use("/social", auth_helper_1.default.authMiddleware, social_media_route_1.default);
app.use("/product", auth_helper_1.default.authMiddleware, products_route_1.default);
app.use('/transaction', auth_helper_1.default.authMiddleware, transaction_route_1.default);
app.use('/payment', auth_helper_1.default.authMiddleware, payment_route_1.default);
app.use('/membership', auth_helper_1.default.authMiddleware, subscription_route_1.default);
app.use('/profile', auth_helper_1.default.authMiddleware, profile_route_1.default);
app.use('/management', auth_helper_1.default.authMiddleware, management_route_1.default);
app.use("/report", auth_helper_1.default.authMiddleware, report_route_1.default);
app.listen(port, () => {
    console.log(`[server] Server is running at https://localhost:${port}`);
    // Referesh Banking token
    // BRI_service.scheduleRefreshBRIToken();
});
