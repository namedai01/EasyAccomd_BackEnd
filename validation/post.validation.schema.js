import Joi from joi;

const PostSchema = Joi.object({
    title: Joi.string().alphanum().min(3).max(30).required(),    
    no: Joi.string(),
    street:Joi.string(),
    ward: Joi.string(),
    district: Joi.string(),
    city: Joi.string(),
    nearby:Joi.string(),
    type: Joi.string(),
    numOfRoom: Joi.number().min(1).max(20),
    price: Joi.number(),
    size: Joi.number(),
    ownerType:Joi.string(),
    kitchen: Joi.string(),
    balcony: Joi.string(),
    electric: Joi.string(),
    water: Joi.string(),
    otherAmenity: Joi.string(),
    description: Joi.string(),
    airConditioner: Joi.string(),
});

export default PostSchema;
