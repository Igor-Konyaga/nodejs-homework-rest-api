const {
  registerUserValidator,
  loginUserValidator,
} = require("../utils/validators/userValidators");
const { HttpError } = require("../utils/httpError");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { userToken } = require("../services/jwtService");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerUserValidator(req.body);

    if (error) throw new HttpError(400, "Bad Request");

    const { password, email } = value;

    const passwordHash = await bcrypt.hash(password, 10);

    const userData = {
      password: passwordHash,
      email,
    };

    const user = await User.exists({ email });

    if (user) throw new HttpError(409, "Email in use");

    const newUser = await User.create(userData);

    newUser.password = undefined;

    res.status(201).json({
      ResponseBody: { message: "Success", user: newUser },
    });
  } catch (error) {}
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginUserValidator(req.body);

    if (error) throw new HttpError(400, "Bad Request");

    const user = await User.findOne({ email: value.email }).select("+password");

    if (!user) throw new HttpError(401, "Not authorized");

    const isValidPassword = await bcrypt.compare(value.password, user.password);

    if (!isValidPassword) throw new HttpError(401, "Not authorized");

    user.password = undefined;

    const token = userToken(user.id);

    res.status(200).json({ ResponseBody: { token, user } });
  } catch (error) {
    next(error);
  }
};
