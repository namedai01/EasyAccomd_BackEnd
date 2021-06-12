import express from "express";
import mongoose from "mongoose";

// Import mongoose schema
import Renter from "../models/renter.model.js";

// Create controllers
export const updateRenterInfoController = async (req, res) => {
    if (req.user.role !== "renter") {
        return res.status(403).json({ message: "You are not renter" });
    }

    const { id } = req.params;

    const newRenter = {};

    for (const key in req.body) {
        if (req.body[key] !== "") {
            newRenter[key] = req.body[key]
        }
    }

    try {
        const updateRenter = await Renter.findByIdAndUpdate(
            id,
            newRenter,
            { new: true }
        );
        res.json(updateRenter);
    } catch (error) {
        console.log(error);
    }
};

export const getRenterController = async (req, res) => {
    if (req.user.role !== "renter") {
        return res.status(403).json({ message: "You are not renter" });
    }

    const { id } = req.params;

    try {
        const renter = await Renter.findById(id);
        res.status(200).json(renter);
    } catch (error) {
        console.log(error);
    }
};
