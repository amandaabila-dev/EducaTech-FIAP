const express = require('express');
const { requireAuth } = require('./authMiddleware');
const postController = require('./postController');

const router = express.Router();

router.get('/', postController.listPosts);
router.get('/search', postController.searchPosts);
router.get('/:id', postController.getPostById);
router.post('/', requireAuth, postController.createPost);
router.put('/:id', requireAuth, postController.updatePost);
router.delete('/:id', requireAuth, postController.deletePost);

module.exports = router;
