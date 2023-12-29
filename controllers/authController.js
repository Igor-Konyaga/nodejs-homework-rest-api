const { registerUserValidator } = require("../utils/validators/userValidators");
const { HttpError } = require("../utils/httpError");
const User = require("../models/userModel");
const { userToken } = require("../services/jwtService");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerUserValidator(req.body);

    if (error) throw new HttpError(400, "Bad Request");

    const user = await User.exists({ email: value.email });

    if (user) throw new HttpError(409, "Email in use");

    const newUser = await User.create(value);

    newUser.password = undefined;

    res.status(201).json({
      ResponseBody: { message: "Success", user: newUser },
    });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {};
