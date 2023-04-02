const express = require('express');
const router = express.Router();
const PartidoController = require('../controllers/PartidoController');

router.get("/partido",PartidoController.GetPartidoList);
router.get("/create-partido", PartidoController.GetCreatePartido);
router.post("/create-partido", PartidoController.PostCreatePartido);
router.get("/edit-partido/:partidoId", PartidoController.GetEditPartido);
router.post("/edit-partido", PartidoController.PostEditPartido);
router.post("/delete-partido", PartidoController.PostDeletePartido);
router.post("/confirm-delete-partido", PartidoController.PostConfirmDeletePartido);

module.exports = router;