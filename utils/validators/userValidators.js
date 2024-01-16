const Joi = require("joi");
const { regex } = require("../../constans");

const registerUserValidator = (data) => {
  return Joi.object()
    .keys({
      password: Joi.string().min(6).required().regex(regex.PASSWD_REGEX),
      email: Joi.string().email().required(),
      subscription: Joi.string()
        .valid("starter", "pro", "business")
        .default("starter"),
    })
    .validate(data);
};

const loginUserValidator = (data) => {
  return Joi.object()
    .keys({
      password: Joi.string().min(6).required().regex(regex.PASSWD_REGEX),
      email: Joi.string().email().required(),
    })
    .validate(data);
};

const emailValidator = (data) => {
  return Joi.object()
    .keys({
      email: Joi.string().email().required(),
    })
    .validate(data);
};

const subscriptionUserValidator = (data) => {
  return Joi.object()
    .keys({
      subscription: Joi.string().valid("starter", "pro", "business").required(),
    })
    .validate(data);
};
const updateAvatarValidator = (data) => {
  return Joi.object()
    .keys({
      avatarUrl: Joi.string().required(),
    })
    .validate(data);
};

module.exports = {
  registerUserValidator,
  loginUserValidator,
  subscriptionUserValidator,
  updateAvatarValidator,
  emailValidator,
};
