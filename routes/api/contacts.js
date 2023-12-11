const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();

    res.status(200).json(contacts);
  } catch (error) {
    console.log("error: ", error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    res.status(200).json(contact);
  } catch (error) {
    console.log("error: ", error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);

    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const deleteContact = await removeContact(contactId);

  if (!deleteContact) {
    res.status(404).json({ message: "Not Found" });

    return;
  }

  res.status(200).json({ message: "contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await updateContact(id, req.body);

    if (!req.body) {
      res.status(400).json({ message: "missing fields" });

      return;
    }

    if (!contact) {
      res.status(404).json({ message: "Not Found" });

      return;
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
