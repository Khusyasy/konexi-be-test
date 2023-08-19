const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

const authUser = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', authUser, usersController.getUsers);
router.post('/', upload.single('image'), usersController.createUser);
router.patch('/', authUser, upload.single('image'), usersController.updateUser);
router.delete('/', authUser, usersController.deleteUser);

router.get('/:username', authUser, usersController.getUserByUsername);
router.put('/:username/follow', authUser, usersController.followUser);
router.delete('/:username/follow', authUser, usersController.unfollowUser);

module.exports = router;
