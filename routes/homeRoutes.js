const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController.js").homeController;
const registerController = require("../controllers/homeController.js").registerController;
const loginController = require("../controllers/homeController.js").loginController;
const blockverseController = require("../controllers/homeController.js").blockverseController;
const logoutController = require("../controllers/homeController.js").logoutController;
const registerPostController = require("../controllers/homeController.js").registerPostController;
const loginPostController = require("../controllers/homeController.js").loginPostController;

router.get("/", homeController);

router.get("/register", registerController);

router.get("/login", loginController);

router.get("/blockverse", blockverseController);

router.get("/logout", logoutController);

router.post("/register", registerPostController);

router.post("/login", loginPostController);

module.exports = router;
