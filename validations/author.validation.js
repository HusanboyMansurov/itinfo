const Joi = require("joi");

const authorFullName = (parent) => {
  return parent.first_name + " " + parent.last_name;
};

exports.authorValidation = (data) => {
  const authorSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string(),
    full_name: Joi.string().default(authorFullName),
    nick_name: Joi.string().min(2).max(20),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#]{3,30}$")),
    confirm_password: Joi.ref("password"),
    email: Joi.string().email().lowercase(),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/), //93-123-45-67
    info: Joi.string(),
    position: Joi.string(),
    photo: Joi.string().default("/author/avatar.png"),
    is_expert: Joi.boolean().default(false),
    is_active: Joi.boolean().default(false),
    gender: Joi.string().valid("erkak", "ayol"),
    birth_date: Joi.date().less("2000-01-01"),
    birth_year: Joi.number().integer().min(1980).max(1999),
    referred: Joi.boolean().default(false),
    referredDetails: Joi.string().when("referred", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
    coding_langs: Joi.array().items(Joi.string(), Joi.number()),
    is_yes: Joi.boolean().truthy("YES", "HA").valid(true),
  });

  return authorSchema.validate(data, { abortEarly: false });
};
