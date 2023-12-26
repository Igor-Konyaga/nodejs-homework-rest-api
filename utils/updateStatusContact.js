const Contact = require("../models/contact.model");

exports.updateStatusContact = async (id, body) => {
  const updateContact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  return updateContact;
};
