const express = require("express");
const router = express.Router();

const oauthController = require("../controllers/authController.js").oauthController;
const blockverseController = require("../controllers/authController.js").blockverseController;


router.get("/auth/google",oauthController);

router.get("/auth/google/blockverse",blockverseController);

module.exports = router;
