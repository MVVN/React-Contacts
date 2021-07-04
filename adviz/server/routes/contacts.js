const express = require("express");
// const router = express.Router();

// allows middleware to return promises; no try-catch needed
const router = require("express-promise-router")();

const ContactsController = require("../controllers/contactsController");

router.route("/all")
  .get(ContactsController.showAll)

router.route("/")
  .post(ContactsController.postContact)
  .get(ContactsController.getUsersContacts);

router.route("/:id")
  .get(ContactsController.getContact)
  .put(ContactsController.putContact)
  .delete(ContactsController.deleteContact);

router.route("/:userId")
// .get(ContactsController.getUsersContacts);



module.exports = router;