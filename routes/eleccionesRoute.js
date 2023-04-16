const express = require("express");
const router = express.Router();
const EleccionesController = require("../controllers/EleccionesController");
const admintauth = require("../middleware/is-auth");

router.get("/eleccion", admintauth, EleccionesController.GetEleccionesList);
router.get(
  "/create-eleccion",
  admintauth,
  EleccionesController.GetCreateEleccion
);
router.post(
  "/create-eleccion",
  admintauth,
  EleccionesController.PostCreateEleccion
);
// router.get("/edit-eleccion/:eleccionId",admintauth, EleccionesController.GetEditEleccion);
// router.post("/edit-eleccion",admintauth,EleccionesController.PostEditEleccion);
router.post(
  "/delete-eleccion",
  admintauth,
  EleccionesController.PostDeleteElecciones
);
router.post(
  "/confirm-delete-eleccion",
  admintauth,
  EleccionesController.PostConfirmDeleteEleccion
);
router.get(
  "/eleccion-results/:eleccionId",
  admintauth,
  EleccionesController.GetResultadosElecciones
);
router.post(
  "/activar-eleccion",
  admintauth,
  EleccionesController.PostActivarEleccion
);

module.exports = router;
