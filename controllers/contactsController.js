const { Types } = require("mongoose");
const { HttpError } = require("../utils/httpError");
const { updateStatusContact } = require("../utils/updateStatusContact");
const {
  createContactValidator,
  updateContactValidator,
} = require("../utils/validators/contactValidators");

const { Contact } = require("../models/contactModel");

exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const isValidId = Types.ObjectId.isValid(contactId);

    if (!isValidId) throw new HttpError(404, "User not found");

    const contact = await Contact.findById(contactId);

    if (!contact) throw new HttpError(404, "User not found");

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const { value, error } = createContactValidator(req.body);

    if (error) throw new HttpError(400, "Invalid user data!");

    const newContact = await Contact.create(value);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!contactId) throw new HttpError(404, "Not Found");

    const deleteContact = await Contact.findByIdAndDelete(contactId);

    if (!deleteContact) throw new HttpError(404, "Not Found");

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const { value, error } = updateContactValidator(req.body);

    if (error) throw new HttpError(400, "Invalid user data!");

    const updateContact = await Contact.findByIdAndUpdate(contactId, value, {
      new: true,
    });

    if (!updateContact) throw new HttpError(404, "Not Found");

    res.status(200).json(updateContact);
  } catch (error) {
    next(error);
  }
};

exports.updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const body = req.body;

    if (!body) throw new HttpError(400, "missing field favorite");

    const updateContact = await updateStatusContact(contactId, body);

    if (!updateContact) throw new HttpError(404, "Not Found");

    res.status(200).json(updateContact);
  } catch (error) {
    next(error);
  }
};
