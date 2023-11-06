const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController.js").homeController;
const registerController = require("../controllers/homeController.js").registerController;
const loginController = require("../controllers/homeController.js").loginController;

router.get("/", homeController);

router.get("/register", registerController);

router.get("/login", loginController);

module.exports = router;
