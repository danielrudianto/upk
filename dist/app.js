"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const district_route_1 = __importDefault(require("./routes/district.route"));
dotenv_1.default.config();
const firebaseConfig = {
//...
};
const app = (0, express_1.default)();
let JSONParser = body_parser_1.default.json();
var urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
app.use(JSONParser, urlencodedParser);
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.use("/auth", auth_route_1.default);
app.use("/district", district_route_1.default);
app.listen(port, () => {
    console.log(`[server] Server is running at https://localhost:${port}`);
});
