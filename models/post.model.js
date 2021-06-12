import moment from "moment";
import mongoose from "mongoose";

const post = new mongoose.Schema(
    {
        title: {
            type: String,
            // required: true,
        },
        image: [
            {
                type: String,
            },
        ],

        description: {
            type: String
        },

        no: {
            type: String,
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

        // required: true,

        nearby: {
            type: String,
        },

        type: {
            type: String,
        },

        numOfRoom: {
            type: Number,
        },
        // price: {
        //     category: {
        //         type: String,
        //         // required: true,
        //     },
        //     amount: {
        //         type: Number,
        //         // required: true,
        //     },

        //     // required: true,
        // },
        price: {
            type: Number,
        },
        size: {
            type: Number,
            // required: true,
        },
        ownerType: {
            type: String,
        },
        // bathroom: {
        //     category: {
        //         type: String,
        //     },
        //     hot: {
        //         type: String,
        //     },
        // },
        kitchen: {
            type: String,
        },
        airConditioner: {
            type: String,
        },
        balcony: {
            type: String,
        },
        electric: {
            type: String,
            // required: true,
        },
        water: {
            type: String,
            // required: true,
        },
        otherAmenity: {
            type: String,
        },
        // datePost: {
        //     type: Date,
        //     default: moment(Date.now(), "DD-MM-YYYY").add(7, 'days'),
        // },
        dateRemove: {
            type: Date,
            default: moment(Date.now(), "DD-MM-YYYY").add(7, "days"),
        },

        favorite: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Renter",
            },
        ],

        default: [],

        comments: [
            {
                text: String,
                commentedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Renter",
                },
                date: Date,
            },
        ],

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Host",
        },
        // pending: {
        //     type: Boolean,
        //     default: false,
        // },
        status: {
            type: String,
            default: "pending",
        }
    },
    { timestamps: { createdAt: "createdAt" } }
);
const Post = mongoose.model("Post", post);
export default Post;
