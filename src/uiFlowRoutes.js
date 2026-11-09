const express = require('express');
const { requireAuth } = require('./authMiddleware');
const uiFlowController = require('./uiFlowController');
const loginController = require('./loginController');

const router = express.Router();

router.get('/Home', uiFlowController.home);
router.get('/PostPage/:id', uiFlowController.postPage);
router.get('/Login', loginController.getLoginScreen);
router.get('/Admin', uiFlowController.admin);
router.post('/NewPost', requireAuth, uiFlowController.newPost);
router.put('/PostEdition/:id', requireAuth, uiFlowController.postEdition);
router.delete('/PostDeletion/:id', requireAuth, uiFlowController.postDeletion);
router.get('/PostSearch', uiFlowController.postSearch);

router.get('/GestaoConteudo', uiFlowController.admin);
router.post('/PostCreation', requireAuth, uiFlowController.newPost);

module.exports = router;
