import mongoose from "mongoose";

// Import mongoose schema

import Post from "../models/post.model.js";
import Host from "../models/host.model.js";

export const approvePost = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not admin" });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`);

    try {
        const updatedPost = await Post.findByIdAndUpdate(id, { status: "active" }, {
            new: true,
        });

        // console.log(updatedPost);

        res.status(200).json({ message: "Post approved successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}

export const approveHost = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not admin" });
    }

    try {
        const { id } = req.params

        // if (!mongoose.Types.ObjectId.isValid(id))
        //     return res.status(404).send(`No post with id: ${id}`);
        const updatedHost = await Host.findByIdAndUpdate(id, { status: "active" }, {
            new: true,
        })
        console.log(updatedHost);
        res.status(200).json({ message: "Host approved successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
