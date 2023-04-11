const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const admintauth = require("../middleware/is-auth");


router.get("/user",admintauth,UsuarioController.GetUserList);
router.get("/create-user",admintauth, UsuarioController.GetCreateUser);
router.post("/create-user", admintauth,UsuarioController.PostCreateUser);
router.get("/edit-user/:userId", admintauth,UsuarioController.GetEditUser);
router.post("/edit-user", admintauth,UsuarioController.PostEditUser);
router.post("/delete-user", admintauth,UsuarioController.PostDeleteUser);
router.post("/confirm-delete-user",admintauth, UsuarioController.PostConfirmDeleteUser);

module.exports = router;