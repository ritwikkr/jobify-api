import express from "express";

import {
  loginUser,
  registerUser,
  updateUser,
} from "../controller/userController.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/update").put(updateUser);

export default router;
