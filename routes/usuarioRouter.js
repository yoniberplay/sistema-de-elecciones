const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

router.get("/user",UsuarioController.GetUserList);
router.get("/create-user", UsuarioController.GetCreateUser);
router.post("/create-user", UsuarioController.PostCreateUser);
router.get("/edit-user/:userId", UsuarioController.GetEditUser);
router.post("/edit-user", UsuarioController.PostEditUser);
router.post("/delete-user", UsuarioController.PostDeleteUser);
router.post("/confirm-delete-user", UsuarioController.PostConfirmDeleteUser);

module.exports = router;