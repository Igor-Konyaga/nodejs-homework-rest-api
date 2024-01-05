const Contact = require("../models/contactModel");

exports.createUser = async (contactData, owner) => {
  const { name, email, phone, favorite } = contactData;

  const dataContact = {
    name,
    email,
    phone,
    favorite,
    owner,
  };

  const newContact = await Contact.create(dataContact);

  return newContact;
};

exports.updateStatusContact = async (id, body) => {
  const updateContact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  return updateContact;
};
