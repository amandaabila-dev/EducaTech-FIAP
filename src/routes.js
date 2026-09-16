<<<<<<< HEAD
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
=======
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
>>>>>>> b8f4f0c33793c72b70ad636338ed64081ab34625
