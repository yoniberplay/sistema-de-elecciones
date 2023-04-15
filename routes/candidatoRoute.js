const express = require("express");
const router = express.Router();
const CandidatoController = require("../controllers/CandidatoController");
const admintauth = require("../middleware/is-auth");

router.get("/candidato", admintauth, CandidatoController.GetCandidatoList);
router.get(
  "/create-candidato",
  admintauth,
  CandidatoController.GetCreateCandidato
);
router.post(
  "/create-candidato",
  admintauth,
  CandidatoController.PostCreateCandidato
);
router.get(
  "/edit-candidato/:candidatoId",
  admintauth,
  CandidatoController.GetEditCandidato
);
router.post(
  "/edit-candidato",
  admintauth,
  CandidatoController.PostEditCandidato
);
router.post(
  "/delete-candidato",
  admintauth,
  CandidatoController.PostDeleteCandidato
);
router.post(
  "/confirm-delete-candidato",
  admintauth,
  CandidatoController.PostConfirmDeleteCandidato
);
router.post(
  "/activar-candidato",
  admintauth,
  CandidatoController.PostActivarCandidato
);

module.exports = router;
