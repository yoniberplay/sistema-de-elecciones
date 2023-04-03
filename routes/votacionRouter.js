const express = require('express');
const router = express.Router();
const VotacionController = require('../controllers/VotacionController');

const requireAuth = require('../middleware/is-auth')

router.get('/votacion', requireAuth ,VotacionController.getVotacionPage)

module.exports = router;