const express = require("express");
const {  getContact, createContact, deleteContact, updateContact, updateStatusContact, getContacts } = require("../../controllers/contactsController");


const router = express.Router();

router.get("/", getContacts);

router.get("/:contactId", getContact);

router.post("/", createContact);

router.delete("/:contactId", deleteContact);

router.patch("/:contactId", updateContact);

router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
