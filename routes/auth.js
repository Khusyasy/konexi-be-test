const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

const authMiddleware = require('../middlewares/auth');

router.post('/login', authController.login);
router.get('/logout', authMiddleware, authController.logout);

module.exports = router;
