const Contact = require("../models/contactModel");

exports.updateStatusContact = async (id, body) => {
  const updateContact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  return updateContact;
};
