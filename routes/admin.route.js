import express from "express";
import {
    approveHost,
    approvePost
} from "../controllers/admin.controller.js";

import { verifyToken, requireLogin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.put("/approve/posts/:id", verifyToken, requireLogin, approvePost);

router.put("/approve/hosts/:id", verifyToken, requireLogin, approveHost);

export default router;
