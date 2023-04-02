const express = require('express');
const router = express.Router();
const CiudadanoController = require('../controllers/CiudadanoController');

router.get("/ciudadano",CiudadanoController.GetCiudadanoList);
router.get("/create-ciudadano", CiudadanoController.GetCreateCiudadano);
router.post("/create-ciudadano", CiudadanoController.PostCreateCiudadano);
router.get("/edit-ciudadano/:ciudadanoId", CiudadanoController.GetEditCiudadano);
router.post("/edit-ciudadano", CiudadanoController.PostEditCiudadano);
router.post("/delete-ciudadano", CiudadanoController.PostDeleteCiudadano);
router.post("/confirm-delete-ciudadano", CiudadanoController.PostConfirmDeleteCiudadano);

module.exports = router;