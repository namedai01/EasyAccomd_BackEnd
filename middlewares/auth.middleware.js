import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Host from "../models/host.model.js";

// Import mongoose schema
import Renter from "../models/renter.model.js";

// Config dotenv
dotenv.config();

// Config jwt
const JWT_SECRET = process.env.JWT_SECRET;

export const requireLogin = async (req, res, next) => {

    jwt.verify(req.token, JWT_SECRET, (err, authData) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        const { _id, role } = authData;
        if (role === "renter") {
            Renter.findById(_id).then((data) => {
                req.user = {
                    ...authData,
                };
                next();
            });
        } else if (role === "host") {
            Host.findById(_id).then((data) => {
                req.user = {
                    ...authData,
                };
                next();
            });
        } else if (role === "admin") {
            req.user = {
                ...authData,
            };
            next();
        }
    });
};

export const verifyToken = async (req, res, next) => {
    console.log("authData")

    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        return res.status(401).json({ error: "you must be logged in" });
    }
};
