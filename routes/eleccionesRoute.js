const express = require('express');
const router = express.Router();
const EleccionesController = require('../controllers/EleccionesController');

router.get("/eleccion",EleccionesController.GetEleccionesList);
router.get("/create-eleccion", EleccionesController.GetCreateEleccion);
router.post("/create-eleccion", EleccionesController.PostCreateEleccion);
router.get("/edit-eleccion/:eleccionId", EleccionesController.GetEditEleccion);
router.post("/edit-eleccion", EleccionesController.PostEditEleccion);
router.post("/delete-eleccion", EleccionesController.PostDeleteElecciones);
router.post("/confirm-delete-eleccion", EleccionesController.PostConfirmDeleteEleccion);
router.get("/eleccion-results/:eleccionId", EleccionesController.GetResultadosElecciones);

module.exports = router;