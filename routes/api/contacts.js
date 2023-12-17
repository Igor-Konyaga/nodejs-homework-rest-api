const express = require("express");
const { createUserValidator } = require("../../utils/userValidators");
const { httpError } = require("../../helpers/httpError");
const Contact = require("../../models/contact.model");

const router = express.Router();

// router.get("/", async (req, res, next) => {
//   try {

//     res.status(200).json(contacts);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/:contactId", async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const contact = await getContactById(contactId);

//     if (!contact) {
//       res.status(404).json({ message: "Not Foun" });
//       return;
//     }

//     res.status(200).json(contact);
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/", async (req, res, next) => {
  try {
    //  const { value, error } = createUserValidator(req.body);

    //  if (error) throw httpError(400, "Invalid user data!");

    const newContact = await Contact.create(req.body);

    res.status(201).json(newContact);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

// router.delete("/:contactId", async (req, res, next) => {
//   const { contactId } = req.params;
//   const deleteContact = await removeContact(contactId);

//   if (!deleteContact) {
//     res.status(404).json({ message: "Not Found" });

//     return;
//   }

//   res.status(200).json({ message: "contact deleted" });
// });

// router.put("/:contactId", async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const { value, error } = createUserValidator(req.body);

//     if (error) throw httpError(400, "Invalid user data!");

//     const contact = await updateContact(id, value);

//     if (!contact) {
//       res.status(404).json({ message: "Not Found" });

//       return;
//     }

//     res.status(200).json(contact);
//   } catch (error) {
//     res.status(error.status).json({ message: error.message });
//   }
// });

module.exports = router;
