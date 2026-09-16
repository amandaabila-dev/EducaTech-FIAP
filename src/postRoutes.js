<<<<<<< HEAD
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
=======
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
>>>>>>> b8f4f0c33793c72b70ad636338ed64081ab34625
