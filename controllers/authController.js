const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const {
  registerUserValidator,
  loginUserValidator,
  subscriptionUserValidator,
  updateAvatarValidator,
  emailValidator,
} = require("../utils/validators/userValidators");
const { HttpError } = require("../utils/httpError");
const User = require("../models/userModel");
const { userToken } = require("../services/jwtServices");
const { changeResizeAvatar } = require("../utils/avatarHandler");
const { sendEmail } = require("../utils/sendEmail");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerUserValidator(req.body);

    if (error) throw new HttpError(400, "Bad Request");

    const { password, email } = value;

    const passwordHash = await bcrypt.hash(password, 10);

    const avatarUrl = gravatar.url(email, { d: "robohash" });

    const verificationToken = nanoid();

    const userData = {
      password: passwordHash,
      email,
      avatarUrl,
      verificationToken,
    };

    const user = await User.exists({ email });

    if (user) throw new HttpError(409, "Email in use");

    const newUser = await User.create(userData);

    newUser.password = undefined;

    const { BASE_URL } = process.env;

    const verifyEmail = {
      to: email,
      subject: "Verify Email",
      html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}"> Click verify Email </a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      ResponseBody: { message: "Success", user: newUser },
    });
  } catch (error) {}
};

exports.verificationEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) throw new HttpError(404, "Not Found");
    if (user.verify)
      throw new HttpError(401, "Verification has already been passed");

    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });

    res.status(200).json({
      ResponseBody: {
        message: "Verification successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.resendingEmail = async (req, res, next) => {
  const { value, error } = emailValidator(req.body);

  if (error) throw new HttpError(400, "Missing required field email");

  const user = await User.findOne({ email: value.email });

  if (!user) throw new HttpError(400, "User Not Found");
  if (user.verify)
    throw new HttpError(401, "Verification has already been passed");

  const verifyEmail = {
    to: value.email,
    subject: "Verify Email",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}"> Click verify Email </a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    ResponseBody: {
      message: "Verification email sent",
    },
  });
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

    if (!user.verify) throw new HttpError(401, "Email is not verified");

    const token = userToken(user.id);

    res.status(200).json({ token, user });
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

exports.updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, "The image file is missing");

    const { path: currentPath, originalname } = req.file;
    const { _id } = req.user;

    const uniqueFileName = `${_id}-${originalname}`;

    const newPath = path.join(
      __dirname,
      "../",
      "public",
      "avatars",
      uniqueFileName
    );

    await fs.rename(currentPath, newPath);

    const avatarUrl = path.join("avatars", uniqueFileName);

    changeResizeAvatar(avatarUrl);

    const updateUserAvatar = await User.findByIdAndUpdate(_id, { avatarUrl });

    if (!updateUserAvatar) throw new HttpError(401, "Not authorized");

    res.status(200).json({
      ResponseBody: {
        avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
