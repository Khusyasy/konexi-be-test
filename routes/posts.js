const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts');

const authUser = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', authUser, postsController.getPosts);
router.post('/', authUser, upload.single('image'), postsController.createPost);

router.get('/:id', authUser, postsController.getPost);
router.patch('/:id', authUser, postsController.updatePost);
router.delete('/:id', authUser, postsController.deletePost);

router.put('/:id/like', authUser, postsController.likePost);
router.delete('/:id/like', authUser, postsController.unlikePost);

module.exports = router;
