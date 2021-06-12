import express from "express";
const router = express.Router();

import {
    createPostController,
    getPostsController,
    getAPostController,
    likePostController,
    unLikePostController,
    commentPostController,
    updatePostController,
    getFavorPostsController,
    getMyPostsController,
    deletePostController
} from "../controllers/posts.controller.js";

import { verifyToken, requireLogin } from "../middlewares/auth.middleware.js";

router.get("/", getPostsController);

router.get("/:id", getAPostController);

router.post("/", verifyToken, requireLogin, createPostController);

router.put("/:id", verifyToken, requireLogin, updatePostController);

router.put("/comment/:id", verifyToken, requireLogin, commentPostController);

router.get("/myfavor/:id", verifyToken, requireLogin, getFavorPostsController)

router.get("/myposts/:id", verifyToken, requireLogin, getMyPostsController)

router.put("/like/:id", verifyToken, requireLogin, likePostController);

router.put("/unlike/:id", verifyToken, requireLogin, unLikePostController);

router.delete('/:id', verifyToken, requireLogin, deletePostController);



export default router;
