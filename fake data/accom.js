import mongoose from "mongoose";
import express from "express";
import Post from "../models/post.model.js";
import faker from 'faker'
import Obj from "./constant.js";

const router = express.Router();

const status = ["active", "pending"]

router.get('/accom', async(req, res) => {
    //var post = await Post(
    const accom=    {
        status : faker.random.arrayElement(status),
        title: faker.company.companyName(),
        description: faker.commerce.productDescription(),
        water: faker.random.number({ max: 1000, min: 5000 }),
        size: faker.random.number({ max: 50, min: 10 }),
        price: faker.random.number({ max: 2, min: 10 }),
        numOfRoom :faker.random.number({ max: 1, min: 7 }),

        nearby: faker.address.streetAddress(),
        no: faker.random.number({ max: 1000, min: 5000 }) ,

        street: faker.address.streetAddress(),
        ward: faker.address.streetAddress(),

        image: faker.random.arrayElement(Obj.img),

        district: faker.random.arrayElement(Obj.district),

        type: faker.random.arrayElement(Obj.type),

        electric: faker.random.arrayElement(Obj.electric),
        kitchen: faker.random.arrayElement(Obj.kitchen),
        city: faker.random.arrayElement(Obj.city),
    }
    //)
    res.send(accom)

})
export default router;
