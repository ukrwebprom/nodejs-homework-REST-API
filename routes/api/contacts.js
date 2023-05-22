const express = require("express");
const controllers = require("../../controllers/contacts");
const checkParams = require("../../Helpers/checkParams");
const authenticate = require('../../Helpers/authenticate');

const router = express.Router();

router.get("/", authenticate, controllers.getContacts);

router.get("/:contactId", checkParams.isValidId, controllers.getOneContact);

router.post("/", checkParams.postValidate, controllers.addContact);

router.delete("/:contactId", checkParams.isValidId, controllers.deleteContact);

router.put("/:contactId", checkParams.isValidId, checkParams.putValidate, controllers.updateContact);

router.patch("/:contactId/favorite", checkParams.isValidId, checkParams.favoriteValidate, controllers.updateStatusContact);

module.exports = router;
