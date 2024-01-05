const express = require("express");
const {
  getContact,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
  getContacts,
} = require("../../controllers/contactsController");
const { protect } = require("../../middlewares/authMiddleware");
const { checkUserId } = require("../../middlewares/contactsMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getContacts);

router.get("/:contactId", checkUserId, getContact);

router.post("/", createContact);

router.delete("/:contactId", checkUserId, deleteContact);

router.patch("/:contactId", checkUserId, updateContact);

router.patch("/:contactId/favorite", checkUserId, updateStatusContact);

module.exports = router;
