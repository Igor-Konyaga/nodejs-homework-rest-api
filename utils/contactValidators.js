const Joi = require("joi");

const createContactValidator = (data) => {
  return Joi.object()
    .keys({
      name: Joi.string().min(3).max(15).required(),
      email: Joi.string().email().min(5).required(),
      phone: Joi.string().min(5).required(),
      favorite: Joi.boolean().default(false),
    })
    .validate(data);
};
const updateContactValidator = (data) => {
  return Joi.object()
    .keys({
      name: Joi.string().min(3).max(15),
      email: Joi.string().email().min(5),
      phone: Joi.string().min(5),
      favorite: Joi.boolean().default(false),
    })
    .validate(data);
};

module.exports = {
  createContactValidator,
  updateContactValidator
};
