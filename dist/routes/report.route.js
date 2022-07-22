"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = __importDefault(require("../controller/report.controller"));
const router = (0, express_1.Router)();
router.get("/structure", report_controller_1.default.fetchStructure);
router.get("/branch/:child_1/:child_2", report_controller_1.default.fetchBranchStructure);
router.get("/branch/:child_1", report_controller_1.default.fetchBranchStructure);
router.get("/branch", report_controller_1.default.fetchBranchStructure);
router.get("/member", report_controller_1.default.fetchMemberCount);
exports.default = router;
