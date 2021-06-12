import express from "express";

import { getRenterController, updateRenterInfoController } from "../controllers/renter.controller.js";
import { verifyToken, requireLogin } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/:id", verifyToken, requireLogin, getRenterController)
router.put("/:id", verifyToken, requireLogin, updateRenterInfoController)

export default router;
