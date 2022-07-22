import { Router } from "express";
import ReportController from "../controller/report.controller";

const router = Router();

router.get("/structure", ReportController.fetchStructure);

router.get("/branch/:child_1/:child_2", ReportController.fetchBranchStructure);
router.get("/branch/:child_1", ReportController.fetchBranchStructure);
router.get("/branch", ReportController.fetchBranchStructure);

router.get("/member", ReportController.fetchMemberCount);

export default router;