const { Types } = require("mongoose");
const { HttpError } = require("../utils/httpError");

exports.checkUserId = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const isValidId = Types.ObjectId.isValid(contactId);

    if (!isValidId) throw new HttpError(404, "User not found");

    next();
  } catch (error) {
    next(error);
  }
};
