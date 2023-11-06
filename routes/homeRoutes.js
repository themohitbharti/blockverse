const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController.js").homeController;
const registerController = require("../controllers/homeController.js").registerController;
const loginController = require("../controllers/homeController.js").loginController;
const blockverseController = require("../controllers/homeController.js").blockverseController;
const logoutController = require("../controllers/homeController.js").logoutController;
const registerPostController = require("../controllers/homeController.js").registerPostController;
const loginPostController = require("../controllers/homeController.js").loginPostController;
const memberController = require("../controllers/homeController.js").memberController;
const updateMemberDetailsController = require("../controllers/homeController.js").updateMemberDetailsController;

router.get("/", homeController);

router.get("/register", registerController);

router.get("/login", loginController);

router.get("/blockverse", blockverseController);

router.get("/member-details", memberController);

router.get("/logout", logoutController);

router.post("/register", registerPostController);

router.post("/login", loginPostController);

const authenticateMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); 
    } else {
      return res.status(401).json({ error: "Authentication required" });
    }
  };

router.post("/update-member-details", authenticateMiddleware,updateMemberDetailsController);

module.exports = router;
