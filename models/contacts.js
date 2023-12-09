const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

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

const addContact = async ({name, email, phone}) => {
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
	
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
