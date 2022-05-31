import { Router } from 'express';

const router = Router();

router.get("/", (req, res, next) => {
    const last_fetched = (!req.query.last_fetched_post) ? null : req.query.last_fetched_post;
    const page = req.query.page;
})

router.post("/", (req, res, next) => {
    
})

router.delete("/:postId", (req, res, next) => {
    
})

export default router;