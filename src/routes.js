const express = require('express');
const postRoutes = require('./postRoutes');
const uiFlowRoutes = require('./uiFlowRoutes');
const appController = require('./appController');

const router = express.Router();

router.get('/', appController.getAppInfo);
router.get('/health', appController.health);
router.use('/posts', postRoutes);
router.use('/', uiFlowRoutes);

module.exports = router;
