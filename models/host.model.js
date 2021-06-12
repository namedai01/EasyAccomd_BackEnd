import mongoose from "mongoose";

const host = new mongoose.Schema({
    username: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        // required: true,
    },
    phoneNumber: {
        type: String,
        // required: true,
    },
    image: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png"
    },
    fullName: {
        type: String,
    },
    idNumber: {
        type: String,
    },
    no: {
        type: Number,
    },
    street: {
        type: String,
    },
    ward: {
        type: String,
    },
    district: {
        type: String,
    },
    city: {
        type: String,
    },
    // // required: true,
    email: {
        type: String,
        // required: true,
    },
    facebook: {
        type: String,
    },
    instagram: {
        type: String,
    },
    twitter: {
        type: String,
    },
    personId: {
        type: String,
        // // required: true,
    },
    // pending: {
    //     type: Boolean,
    //     default: true,
    // },
    status: {
        type: String,
        default: "pending"
    }
});

const Host = mongoose.model("Host", host);

export default Host;
