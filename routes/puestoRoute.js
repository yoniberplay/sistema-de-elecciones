const express = require('express');
const router = express.Router();
const PuestoController = require('../controllers/PuestoController');

router.get("/puesto",PuestoController.GetPuestoList);
router.get("/create-puesto", PuestoController.GetCreatePuesto);
router.post("/create-puesto", PuestoController.PostCreatePuesto);
router.get("/edit-puesto/:puestoId", PuestoController.GetEditPuesto);
router.post("/edit-puesto", PuestoController.PostEditPuesto);
router.post("/delete-puesto", PuestoController.PostDeletePuesto);
router.post("/confirm-delete-puesto", PuestoController.PostConfirmDeletePuesto);

module.exports = router;