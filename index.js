import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// import routes
import authRoutes from "./routes/auth.route.js";
import postsRoutes from "./routes/post.route.js";
import renterRoutes from "./routes/renter.route.js";
import hostRoutes from "./routes/host.route.js";
import adminRoutes from "./routes/admin.route.js"
import fake from './fake data/accom.js'
// Config express and port
const app = express();
const PORT = process.env.PORT || 5000;

// Config dotenv
dotenv.config();

// Config bodyParser
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Config cors
app.use(cors());

// Config mongoose
const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
const connection = mongoose.connection
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// routes
app.use("/auth", authRoutes);

app.use("/posts", postsRoutes);

app.use("/renter", renterRoutes);

app.use("/host", hostRoutes)

app.use("/admin", adminRoutes)

app.use("/fake", fake)

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
