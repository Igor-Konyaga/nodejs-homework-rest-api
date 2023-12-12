const Joi = require("joi");

const createUserValidator = (data) => {
  return Joi.object()
    .keys({
      name: Joi.string().min(3).max(15).required(),
      email: Joi.string().min(5).required(),
      phone: Joi.string().min(5).required(),
    })
    .validate(data);
};

module.exports = {
  createUserValidator,
};
