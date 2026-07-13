const postService = require('./PostService');
const { mapPostForRest, mapPostsForRest } = require('./postMapper');

async function listPosts(req, res, next) {
  try {
    const result = await postService.findAll(req.query);
    if (Array.isArray(result)) {
      res.json(mapPostsForRest(result));
    } else {
      res.json({ ...result, items: mapPostsForRest(result.items) });
    }
  } catch (error) {
    next(error);
  }
}

async function getPostById(req, res, next) {
  try {
    res.json(mapPostForRest(await postService.findById(req.params.id)));
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    res.status(201).json(mapPostForRest(await postService.create(req.body)));
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    res.json(mapPostForRest(await postService.update(req.params.id, req.body)));
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    await postService.delete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function searchPosts(req, res, next) {
  try {
    res.json(mapPostsForRest(await postService.search(req.query.q)));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
};
