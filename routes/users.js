const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

const authMiddleware = require('../middlewares/auth');

router.get('/', usersController.getUsers);
router.post('/', usersController.createUser);
router.get('/:id', authMiddleware, usersController.getUser);
router.patch('/:id', authMiddleware, usersController.updateUser);
router.delete('/:id', authMiddleware, usersController.deleteUser);

module.exports = router;
