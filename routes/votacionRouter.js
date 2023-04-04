const express = require('express');
const router = express.Router();
const VotacionController = require('../controllers/VotacionController');

const requireAuth = require('../middleware/is-auth')


//! Creacion de middleware para que solo una session.ciudadano pueda accder
//! y luego que valide si ya ha votado por alguno para redirigirlo solo a donde no haya votado
router.get('/votacion', VotacionController.getVotacionPage);

module.exports = router;