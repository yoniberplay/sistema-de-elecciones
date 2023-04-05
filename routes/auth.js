const express = require("express");

const authController = require("../controllers/AuthController");
const admintauth = require("../middleware/is-auth");
const baseauth = require("../middleware/baseauth");

const router = express.Router();

router.get("/",baseauth, authController.GetLoginCiudadano);
router.get("/admin",admintauth, authController.GetAdminHome);
router.post("/login-ciudadano", authController.PostLoginCiudadano);
router.get("/login", authController.GetLogin);
router.post("/login", authController.PostLogin);
router.post("/logout", authController.Logout);
// router.get("/signup", authController.GetSignup);
// router.post("/signup", authController.PostSignup);

module.exports = router;
