const express = require("express");
const router = express.Router();
const checkParams = require("../../Helpers/checkParams");
const {signupSchema, loginSchema} = require('../../models/user');
const controllers = require('../../controllers/auth');

router.post("/register", checkParams.validateBody(signupSchema), controllers.register);
router.post("/login", checkParams.validateBody(loginSchema), controllers.login);

module.exports = router;