const {
  registerUserValidator,
  loginUserValidator,
  subscriptionUserValidator,
} = require("../utils/validators/userValidators");
const { HttpError } = require("../utils/httpError");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { userToken } = require("../services/jwtService");
const { json } = require("express");

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

    if (!user) throw new HttpError(401, "Email or password is wrong");

    const isValidPassword = await bcrypt.compare(value.password, user.password);

    if (!isValidPassword)
      throw new HttpError(401, "Email or password is wrong");

    user.password = undefined;

    const token = userToken(user.id);

    res.status(200).json({ ResponseBody: { token, user } });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    req.user.token = undefined;

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

exports.current = (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) throw new HttpError(401, "Not authorized");

    res.status(200).json(currentUser);
  } catch (error) {
    next(error);
  }
};

exports.updateSubscriptionUser = async (req, res, next) => {
  try {
    if (!req.body) throw new HttpError(400, "missing field favorite");

    const { value, error } = subscriptionUserValidator(req.body);

    if (error) throw new HttpError(404, "Not Found");

    const updateUser = await User.findByIdAndUpdate(req.user.id, value, {
      new: true,
    });

    if (!updateUser) throw new HttpError(404, "Not Found");

    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};
