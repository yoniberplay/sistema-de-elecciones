const express = require('express');
const router = express.Router();
const CiudadanoController = require('../controllers/CiudadanoController');
const admintauth = require("../middleware/is-auth");

router.get("/ciudadano",admintauth,CiudadanoController.GetCiudadanoList);
router.get("/create-ciudadano",admintauth, CiudadanoController.GetCreateCiudadano);
router.post("/create-ciudadano", admintauth,CiudadanoController.PostCreateCiudadano);
router.get("/edit-ciudadano/:ciudadanoId",admintauth, CiudadanoController.GetEditCiudadano);
router.post("/edit-ciudadano", admintauth,CiudadanoController.PostEditCiudadano);
router.post("/delete-ciudadano", admintauth,CiudadanoController.PostDeleteCiudadano);
router.post("/confirm-delete-ciudadano", admintauth,CiudadanoController.PostConfirmDeleteCiudadano);

module.exports = router;