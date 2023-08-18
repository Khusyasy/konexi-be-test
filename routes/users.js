const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

const authUser = require('../middlewares/auth');

router.get('/', authUser, usersController.getUsers);
router.post('/', usersController.createUser);
router.patch('/', authUser, usersController.updateUser);
router.delete('/', authUser, usersController.deleteUser);

router.get('/:username', authUser, usersController.getUserByUsername);
router.get('/:username/follow', authUser, usersController.followUser);
router.delete('/:username/follow', authUser, usersController.unfollowUser);

module.exports = router;
