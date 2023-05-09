import express from "express";
import {
  createJobs,
  deleteJobs,
  getJobs,
  getSingleJob,
} from "../controller/jobsController.js";

const router = express.Router();

router.route("/create").post(createJobs);
router.route("/job/:id").get(getSingleJob);
router.route("/:userId").get(getJobs);
router.route("/:id").delete(deleteJobs);

export default router;
