const express = require('express');
const router = express.Router();
const VotacionController = require('../controllers/VotacionController');

const requireAuth = require('../middleware/ciudadano-auth')

//! y luego que valide si ya ha votado por alguno para redirigirlo solo a donde no haya votado
router.get('/votacion', requireAuth, VotacionController.getVotacionPage);

module.exports = router;