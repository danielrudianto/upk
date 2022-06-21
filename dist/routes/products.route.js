"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("../controller/product.controller"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get("/getByCodeName/:codeName", (0, express_validator_1.param)("codeName").not().isEmpty(), product_controller_1.default.getByCodeName);
router.get("/:groupName", product_controller_1.default.fetch);
router.get("/:groupName/:childGroupName", product_controller_1.default.fetch);
router.get("/", product_controller_1.default.fetch);
exports.default = router;
