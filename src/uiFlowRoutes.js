const express = require('express');
const uiFlowController = require('./uiFlowController');
const loginController = require('./loginController');

const router = express.Router();

router.get('/Home', uiFlowController.home);
router.get('/PostPage/:id', uiFlowController.postPage);
router.get('/Login', loginController.login);
router.get('/Admin', uiFlowController.admin);
router.post('/NewPost', uiFlowController.newPost);
router.put('/PostEdition/:id', uiFlowController.postEdition);
router.delete('/PostDeletion/:id', uiFlowController.postDeletion);
router.get('/PostSearch', uiFlowController.postSearch);

router.get('/GestaoConteudo', uiFlowController.admin);
router.post('/PostCreation', uiFlowController.newPost);

module.exports = router;
