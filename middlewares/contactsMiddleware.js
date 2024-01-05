const { Types } = require("mongoose");
const { HttpError } = require("../utils/httpError");
const {
  createContactValidator,
} = require("../utils/validators/contactValidators");
const { createUser } = require("../services/contactsServices");

exports.checkContactId = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const isValidId = Types.ObjectId.isValid(contactId);

    if (!isValidId) throw new HttpError(404, "User not found");

    next();
  } catch (error) {
    next(error);
  }
};
exports.checkCreateUserData = async (req, res, next) => {
  try {
    const { value, error } = createContactValidator(req.body);

    if (error) throw new HttpError(400, "Invalid user data!");

    const newContact = await createUser(value, req.user);

    if (!newContact) throw new HttpError(404, "Not Found!");

    req.contact = newContact;

    next();
  } catch (error) {
    next(error);
  }
};
