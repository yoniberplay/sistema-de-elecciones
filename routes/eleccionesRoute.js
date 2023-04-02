const express = require('express');
const router = express.Router();
const EleccionesController = require('../controllers/EleccionesController');

router.get("/eleccion",EleccionesController.GetCiudadanoList);
router.get("/create-eleccion", EleccionesController.GetCreateCiudadano);
router.post("/create-eleccion", EleccionesController.PostCreateCiudadano);
router.get("/edit-eleccion/:eleccionId", EleccionesController.GetEditCiudadano);
router.post("/edit-eleccion", EleccionesController.PostEditCiudadano);
router.post("/delete-eleccion", EleccionesController.PostDeleteCiudadano);
router.post("/confirm-delete-eleccion", EleccionesController.PostConfirmDeleteCiudadano);

module.exports = router;