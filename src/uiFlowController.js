const postService = require('./PostService');
const { APP, buildUiFlowResponse } = require('./constants');

async function home(req, res, next) {
  try {
    const posts = await postService.findAll();
    res.json(
      buildUiFlowResponse(APP.screens.home, APP.profiles.aluno, APP.pageTitles.home, {
        Posts: posts,
      })
    );
  } catch (error) {
    next(error);
  }
}

async function postPage(req, res, next) {
  try {
    const post = await postService.findById(req.params.id);
    res.json(
      buildUiFlowResponse(APP.screens.postPage, APP.profiles.aluno, APP.pageTitles.postPage, {
        Post: post,
      })
    );
  } catch (error) {
    next(error);
  }
}

async function admin(req, res, next) {
  try {
    const posts = await postService.findAll();
    res.json(
      buildUiFlowResponse(APP.screens.admin, APP.profiles.professor, APP.pageTitles.admin, {
        Posts: posts,
      })
    );
  } catch (error) {
    next(error);
  }
}

async function newPost(req, res, next) {
  try {
    const post = await postService.create(req.body);
    res.status(201).json(
      buildUiFlowResponse(APP.screens.newPost, APP.profiles.professor, APP.pageTitles.newPost, {
        Message: 'Postagem criada com sucesso',
        Post: post,
      })
    );
  } catch (error) {
    next(error);
  }
}

async function postEdition(req, res, next) {
  try {
    const post = await postService.update(req.params.id, req.body);
    res.json(
      buildUiFlowResponse(
        APP.screens.postEdition,
        APP.profiles.professor,
        APP.pageTitles.postEdition,
        { Message: 'Postagem atualizada com sucesso', Post: post }
      )
    );
  } catch (error) {
    next(error);
  }
}

async function postDeletion(req, res, next) {
  try {
    await postService.delete(req.params.id);
    res.json(
      buildUiFlowResponse(
        APP.screens.postDeletion,
        APP.profiles.professor,
        APP.pageTitles.postDeletion,
        { Message: 'Post excluído com sucesso' }
      )
    );
  } catch (error) {
    next(error);
  }
}

async function postSearch(req, res, next) {
  try {
    const posts = await postService.search(req.query.q);
    res.json(
      buildUiFlowResponse(APP.screens.postSearch, APP.profiles.aluno, APP.pageTitles.postSearch, {
        Query: req.query.q,
        Posts: posts,
      })
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  home,
  postPage,
  admin,
  newPost,
  postEdition,
  postDeletion,
  postSearch,
};
