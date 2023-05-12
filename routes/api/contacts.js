const express = require("express");
const controllers = require("../../controllers/contacts");
const checkParams = require("../../Helpers/checkParams");

const router = express.Router();

router.get("/", controllers.getContacts);

router.get("/:contactId", controllers.getOneContact);

router.post("/", checkParams.postValidate(), controllers.addContact);

router.delete("/:contactId", controllers.deleteContact);

router.put("/:contactId", checkParams.putValidate(), controllers.updateContact);

module.exports = router;
