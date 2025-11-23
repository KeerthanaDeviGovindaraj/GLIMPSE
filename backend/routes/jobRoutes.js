import express from "express";
import { createJob, getJobs } from "../controllers/jobController.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", authRequired, createJob);
router.get("/", authRequired, getJobs);

export default router;
