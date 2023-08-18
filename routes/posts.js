const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts');

const authUser = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', authUser, postsController.getPosts);
router.post('/', authUser, upload.single('image'), postsController.createPost);

module.exports = router;
