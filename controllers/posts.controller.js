import express from "express";
import moment from "moment";
import mongoose from "mongoose";

// Import mongoose schema

import Post from "../models/post.model.js";
import Renter from "../models/renter.model.js";

// Create routes
const getAllPosts = async () => {
    const post = await Post.find({ status: "active" })
        .populate("postedBy", "_id name")
        .sort("createdAt");
    // .select("price.amount")
    return post;
};

const getPostsByQuery = async (query) => {
    let { size, price } = query;
    if (size !== undefined) {
        size = size * 10;
        if (size !== 50) {
            query.size = { $gte: size - 10, $lte: size };
        } else {
            query.size = { $gte: size - 10 };
        }
    }
    if (price !== undefined) {
        // price = price * 1000
        if (price !== "5") query.price = { $gte: price - 1, $lte: price };
        else query.price = { $gte: price - 1 };
    }

    const post = await Post.find(query)
        .populate("postedBy", "_id name")
        .sort("createdAt");
    // .select("price.amount")
    return post;
};

export const getPostsController = async (req, res) => {
    try {
        const post =
            Object.keys(req.query).length !== 0
                ? await getPostsByQuery(req.query)
                : await getAllPosts();

        // const post = await Post.find()
        //     .populate("postedBy", "_id name")
        //     // .select("price.amount")
        //     .sort("createdAt");
        res.status(200).json({ post });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getFavorPostsController = async (req, res) => {
    // const post = Object.keys(req.query).length !== 0 ? getPostsByQuery : getAllPosts;
    const { id } = req.params;

    try {
        const posts = await Post.find({ favorite: id })
            // .populate("postedBy", "_id name")
            // .select("price.amount")
            .sort("createdAt");

        // console.log(posts.posts.title);

        res.status(200).json({ posts });
    } catch (error) {
        console.log(error);
    }
};

export const getMyPostsController = async (req, res) => {
    const { id } = req.params;
    try {
        const posts = await Post.find({ postedBy: id, status: "pending" })
            // .populate("postedBy", "_id name")
            // .select("price.amount")
            .sort("createdAt");
        res.status(200).json({ posts });
    } catch (error) {
        console.log(error);
    }
};

export const getAPostController = async (req, res) => {
    const { id } = req.params;

    try {
        const posts = await Post.findById(id)
            .populate("postedBy", "_id username phoneNumber")
            .populate("comments.commentedBy", "image username _id phoneNumber")
            .sort("createdAt");
        res.status(200).json({ posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createPostController = async (req, res) => {
    if (req.user.role !== "host") {
        return res.status(403).json({ message: "You are not host" });
    }

    const newPostModel = new Post({
        ...req.body,
        postedBy: req.user._id,
    });

    try {
        newPostModel.save();

        res.status(200).json(newPostModel);
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
};

export const deletePostController = async (req, res) => {
    if (req.user.role !== "host") {
        return res.status(403).json({ message: "You are not host" });
    }

    const { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(404).send(`No post with id: ${id}`);
    // }
    try {
        await Post.findById(id)
            .populate("postedBy", "_id")
            .exec((error, post) => {
                if (error || !post) {
                    return res.status(404).json({ message: error.message });
                }
                if (post.postedBy._id.toString() === req.user._id.toString()) {
                    post.remove();
                }
            });

        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.log(error);
    }
};

export const likePostController = async (req, res) => {
    if (req.user.role !== "renter") {
        return res.status(403).json({ message: "You are not renter" });
    }

    const { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(404).send(`No post with id: ${id}`);
    // }
    try {
        const updatePost = await Post.findByIdAndUpdate(
            id,
            {
                $push: {
                    favorite: req.user._id,
                },
            },
            { new: true }
        );
        res.json(updatePost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const unLikePostController = async (req, res) => {
    if (req.user.role !== "renter") {
        return res.status(403).json({ message: "You are not renter" });
    }
    const { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(404).send(`No post with id: ${id}`);
    // }
    try {
        const updatePost = await Post.findByIdAndUpdate(
            id,
            {
                $pull: {
                    favorite: req.user._id,
                },
            },
            { new: true }
        );
        res.json(updatePost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const commentPostController = async (req, res) => {
    if (req.user.role !== "renter") {
        return res.status(403).json({ message: "You are not renter" });
    }
    const { id } = req.params;

    const comments = {
        text: req.body.text,
        commentedBy: req.user._id,
        date: new Date(Date.now())
    };
    try {
        const updatedComment = await Post.findByIdAndUpdate(
            id,
            {
                $push: {
                    comments,
                },
            },
            { new: true }
        ).populate("comments.commentedBy", "image username _id phoneNumber");

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updatePostController = async (req, res) => {
    if (req.user.role !== "host") {
        return res.status(403).json({ message: "You are not host" });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`);

    try {
        const findPost = await Post.findById(id);
        delete req.body.status; // Not allow host update the post

        if (findPost.postedBy != req.user._id) {
            res.status(403).json({ message: "You cannot update" });
        }
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

    res.json(updatedPost);
};
