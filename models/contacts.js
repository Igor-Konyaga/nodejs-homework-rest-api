const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");
const { httpError } = require("../helpers/httpError");
const { createUserValidator } = require("../utils/userValidators");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return await JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);

  return result || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);

  return result;
};

const addContact = async (data) => {
  const { value, error } = createUserValidator(data);

  if (error) throw httpError(400, "Invalid user data!");

  const { name, email, phone } = value;

  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  const contacts = await listContacts();
  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
};

const updateContact = async (contactId, body) => {
  const { value, error } = createUserValidator(body);

  if (error) throw httpError(400, "Invalid user data!");

  const contacts = await listContacts();
  const updateContact = contacts.find((contact) => contact.id === contactId);

  const result = { ...updateContact, ...value };

  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
