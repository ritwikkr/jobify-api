import express from "express";
import {
  createJobs,
  deleteJobs,
  getJobs,
} from "../controller/jobsController.js";

const router = express.Router();

router.route("/create").post(createJobs);
router.route("/:userId").get(getJobs);
router.route("/:id").delete(deleteJobs);

export default router;
