const express = require("express");
const router = express.Router();
const checkParams = require("../../Helpers/checkParams");
const authenticate = require('../../Helpers/authenticate');
const {signupSchema, loginSchema, updateSubscriptionSchema, updateAvatarSchema} = require('../../models/user');
const controllers = require('../../controllers/auth');
const upload = require('../../middlewares/upload');

router.post("/register", checkParams.validateBody(signupSchema), controllers.register);
router.post("/login", checkParams.validateBody(loginSchema), controllers.login);
router.post("/logout", authenticate, controllers.logout);
router.get("/current", authenticate, controllers.current);
router.patch("/", authenticate, checkParams.validateBody(updateSubscriptionSchema), controllers.update);
router.patch('/avatars', upload.single('avatar'), authenticate, controllers.updateAvatar);

module.exports = router;