const express = require('express');
const postController = require('./postController');

const router = express.Router();

router.get('/', postController.listPosts);
router.get('/search', postController.searchPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
