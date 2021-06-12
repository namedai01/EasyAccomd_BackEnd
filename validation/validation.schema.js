import Joi from "joi";

const authSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    fullName: Joi.string(),
    idNumber: Joi.number(),
    repeat_password: Joi.ref('password'),
    access_token: [Joi.string(), Joi.number()],
    phoneNumber: Joi.number(),
    birth_year: Joi.number().integer().min(1900).max(2013),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),
});

export default authSchema;
