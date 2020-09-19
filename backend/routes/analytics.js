const express = require('express');
const passport = require('passport');
const router = express.Router();

const controller = require('../controllers/analytics');

router.get('/overwiew', passport.authenticate('jwt', {session: false}), controller.overwiew);
router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics);

module.exports = router;