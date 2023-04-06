const express = require('express');
const router = express.Router();
const PuestoController = require('../controllers/PuestoController');
const admintauth = require("../middleware/is-auth");


router.get("/puesto",admintauth, PuestoController.GetPuestoList);
router.get("/create-puesto", admintauth, PuestoController.GetCreatePuesto);
router.post("/create-puesto", admintauth, PuestoController.PostCreatePuesto);
router.get("/edit-puesto/:puestoId", admintauth, PuestoController.GetEditPuesto);
router.post("/edit-puesto", admintauth, PuestoController.PostEditPuesto);
router.post("/delete-puesto", admintauth, PuestoController.PostDeletePuesto);
router.post("/confirm-delete-puesto", admintauth, PuestoController.PostConfirmDeletePuesto);

module.exports = router;