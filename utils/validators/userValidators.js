const Joi = require("joi");
const { regex } = require("../../constans");

const registerUserValidator = (data) => {
  return Joi.object().keys({
    password: Joi.string().min(6).required().regex(regex.PASSWD_REGEX),
    email: Joi.string().email().required(),
    subscription: Joi.string().valid(["starter", "pro", "business"]),
  });
};

module.exports = {
  registerUserValidator,
};
