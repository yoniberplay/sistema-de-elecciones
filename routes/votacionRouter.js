const express = require('express');
const router = express.Router();
const VotacionController = require('../controllers/VotacionController');

const {ciudadanoAuth: Auth, votingCiudadanoTracking: vct} = require('../middleware/ciudadano-auth')

//! y luego que valide si ya ha votado por alguno para redirigirlo solo a donde no haya votado
router.get('/votacion',  Auth, vct, VotacionController.getVotacionPage);

// router.get('/page',  Auth, VotacionController.getPage);
router.get('/puestosNoVotados', vct,  Auth, VotacionController.puestosNoVotadosCiudadano);

router.get('/getCandidatoList/:puestoId', Auth, VotacionController.GetCandidatoList);

module.exports = router;