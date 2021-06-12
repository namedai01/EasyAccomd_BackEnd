import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Import mongoose schema
import Host from "../models/host.model.js";
import Renter from "../models/renter.model.js";
import authSchema from "../validation/validation.schema.js";

// Config bcrypt
const saltRounds = 12;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

// Config dotenv
dotenv.config();

// Config jwt
const JWT_SECRET = process.env.JWT_SECRET;

// Create controllers

export const renterRegisterController = async (req, res) => {
    const { username, password, phoneNumber } = req.body;
    console.log("kjiji")

    if (!username || !password || !phoneNumber) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    const { result, error } = authSchema.validate(req.body);

    console.log(error);

    if (error === undefined) {
        try {
            // Check rentel exist ?
            await Renter.findOne({ phoneNumber }).then((saveRenter) => {
                if (saveRenter) {
                    return res
                        .status(422)
                        .json({ error: "User already exists" });
                }
                // console.log(saveRenter)

                // Hash password and create nick and save
                bcrypt
                    .hash(password, saltRounds)
                    .then(async (hashedPassword) => {
                        const renter = new Renter({
                            username,
                            password: hashedPassword,
                            phoneNumber,
                        });

                        try {
                            await renter.save();
                            res.status(201).json({
                                message: "Saved successfully",
                            });
                        } catch (error) {
                            res.status(409).json({ message: error });
                        }
                    });
            });
        } catch (error) {
            res.status(404).json({ message: error });
        }
    } else {
        res.json({ message: error });
    }
};

export const renterLoginController = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(422)
            .json({ error: "Please add username or password" });
    }

    const { result, error } = authSchema.validate(req.body);

    if (error === undefined) {
        try {
            Renter.findOne({ username }).then(async (saveRenter) => {
                if (!saveRenter) {
                    return res
                        .status(422)
                        .json({ error: "Invalid username or password" });
                }

                // Check nick exists
                const match = await bcrypt.compare(
                    password,
                    saveRenter.password
                );

                if (match) {
                    // Create token
                    const token = jwt.sign(
                        { _id: saveRenter._id, role: "renter" },
                        JWT_SECRET
                    );
                    const { _id, username, password, phoneNumber } = saveRenter;

                    res.json({
                        token,
                        user: {
                            _id,
                            username,
                            phoneNumber,
                        },
                        role: "renter",
                    });
                } else {
                    return res
                        .status(422)
                        .json({ error: "Invalid usename or password" });
                }
            });
        } catch (error) {
            res.status(404).json({ message: error });
        }
    } else {
        res.json({ message: error });
    }
};

export const hostRegisterController = async (req, res) => {
    const { username, password, phoneNumber, email, fullName } = req.body;

    if (!username || !password || !phoneNumber || !fullName || !email) {
        return res.json({ error: "Please add all the fields" });
    }

    const { result, error } = authSchema.validate(req.body);

    if (error === undefined) {
        try {
            // Check rentel exist ?
            await Host.findOne({ phoneNumber: req.body.phoneNumber }).then(
                (saveHost) => {
                    if (saveHost) {
                        console.log(saveHost);
                        return res
                            .status(422)
                            .json({ error: "Host already exists" });
                    }

                    // Hash password and create nick and save
                    bcrypt
                        .hash(req.body.password, saltRounds)
                        .then(async (hashedPassword) => {
                            delete req.body.status; // Not allow host to change state
                            const host = new Host({
                                ...req.body,
                                password: hashedPassword,
                            });

                            try {
                                await host.save();
                                res.status(201).json({
                                    message: "Saved successfully",
                                });
                            } catch (error) {
                                console.log(error);
                                res.status(409).json({ message: error });
                            }
                        });
                }
            );
        } catch (error) {
            res.status(404).json({ message: error });
        }
    } else {
        res.json({ message: error });
    }
};

export const hostLoginController = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(422)
            .json({ error: "Please add username or password" });
    }

    const { result, error } = authSchema.validate(req.body);

    if (error === undefined) {
        try {
            await Host.findOne({ username }).then(async (saveHost) => {
                if (!saveHost) {
                    return res
                        .status(422)
                        .json({ error: "Invalid username or password" });
                }

                if (saveHost.status === "pending") {
                    return res.status(422).json({
                        error: "Your register request hasn't been accepted",
                    });
                }

                // Check nick exists
                const match = await bcrypt.compare(password, saveHost.password);

                if (match) {
                    // Create token
                    const token = jwt.sign(
                        { _id: saveHost._id, role: "host" },
                        JWT_SECRET
                    );
                    const { _id, username, phoneNumber } = saveHost;

                    res.json({
                        token,
                        user: {
                            _id,
                            username,
                            phoneNumber,
                        },
                        role: "host",
                    });
                } else {
                    return res
                        .status(422)
                        .json({ error: "Invalid usename or password" });
                }
            });
        } catch (error) {
            res.status(404).json({ message: error });
        }
    } else {
        res.json({ message: error });
    }
};

export const adminLoginController = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(422)
            .json({ error: "Please add username or password" });
    }

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        const token = jwt.sign({ role: "admin" }, JWT_SECRET);
        res.json({
            token,
            role: "admin",
        });
    } else {
        return res.status(422).json({ error: "Invalid username or password" });
    }
};
