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
const {
  checkContactId,
  checkCreateUserData,
} = require("../../middlewares/contactsMiddleware");

const router = express.Router();

router.use(protect);
router.use("/:contactId", checkContactId);

router.get("/", getContacts);

router.get("/:contactId", getContact);

router.post("/", checkCreateUserData, createContact);

router.delete("/:contactId", deleteContact);

router.patch("/:contactId", updateContact);

router.patch("/:contactId/favorite", checkContactId, updateStatusContact);

module.exports = router;
