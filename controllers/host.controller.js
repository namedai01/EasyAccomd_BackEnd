import express from "express";
import mongoose from "mongoose";

// Import mongoose schema
import Host from "../models/host.model.js";

// Create controllers
export const updateHostInfoController = async (req, res) => {
    if (req.user.role !== "host") {
        return res.status(403).json({ message: "You are not host" });
    }

    const { id } = req.params;

    const newHost = {};

    for (const key in req.body) {
        if (req.body[key] !== "") {
            newHost[key] = req.body[key]
        }
    }

    try {
        const updateHost = await Host.findByIdAndUpdate(
            id,
            newHost,
            { new: true }
        );
        res.json(updateHost);
    } catch (error) {
        console.log(error);
    }
};

export const getHostController = async (req, res) => {
    if (req.user.role !== "host") {
        return res.status(403).json({ message: "You are not host" });
    }

    const { id } = req.params;

    try {
        const host = await Host.findById(id);
        res.status(200).json(host);
    } catch (error) {
        console.log(error);
    }
};

export const getHostsController = async (req, res) => {
    try {
        let { status } = req.query
        const hosts = await Host.find({ status })
            .select("image fullName personId username phoneNumber status")
            // .select("price.amount")
            .sort("createdAt");
        res.status(200).json({ hosts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};