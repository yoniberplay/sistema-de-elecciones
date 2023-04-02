const express = require('express');
const router = express.Router();
const CandidatoController = require('../controllers/CandidatoController');

router.get("/candidato",CandidatoController.GetCandidatoList);
router.get("/create-candidato", CandidatoController.GetCreateCandidato);
router.post("/create-candidato", CandidatoController.PostCreateCandidato);
router.get("/edit-candidato/:candidatoId", CandidatoController.GetEditCandidato);
router.post("/edit-candidato", CandidatoController.PostEditCandidato);
router.post("/delete-candidato", CandidatoController.PostDeleteCandidato);
router.post("/confirm-delete-candidato", CandidatoController.PostConfirmDeleteCandidato);

module.exports = router;