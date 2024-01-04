const User = require("../models/userModel");
const { checkToken } = require("../services/jwtServices");
const { HttpError } = require("../utils/httpError");

exports.protect = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer ") &&
      req.headers.authorization.split(" ")[1];

    if (!token) throw new HttpError(401, "Not authorized");

    const userId = await checkToken(token);

    if (!userId) throw new HttpError(401, "Not authorized");

    const currentUser = await User.findById(userId).select("-password");

    if (!currentUser) throw new HttpError(401, "Not authorized");

    req.user = currentUser;

    next();
  } catch (error) {
	next(error)
  }
};
