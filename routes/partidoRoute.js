const express = require('express');
const router = express.Router();
const PartidoController = require('../controllers/PartidoController');
const admintauth = require("../middleware/is-auth");

router.get("/partido",admintauth,PartidoController.GetPartidoList);
router.get("/create-partido", admintauth,PartidoController.GetCreatePartido);
router.post("/create-partido",admintauth, PartidoController.PostCreatePartido);
router.get("/edit-partido/:partidoId", admintauth,PartidoController.GetEditPartido);
router.post("/edit-partido", admintauth,PartidoController.PostEditPartido);
router.post("/delete-partido", admintauth,PartidoController.PostDeletePartido);
router.post("/confirm-delete-partido",admintauth, PartidoController.PostConfirmDeletePartido);

module.exports = router;