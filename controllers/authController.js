const { registerUserValidator } = require("../utils/validators/userValidators");
const { HttpError } = require("../utils/httpError");
const User = require("../models/userModel");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerUserValidator(req.body);

    if (error) throw new HttpError(400, "Bad Request");

    const newUser = await User.create(value);

    res.status(201).json({
      ResponseBody: { message: "Success", user: newUser },
    });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {};
