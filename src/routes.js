const express = require('express');
const postRoutes = require('./postRoutes');
const teacherRoutes = require('./teacherRoutes');
const studentRoutes = require('./studentRoutes');
const uiFlowRoutes = require('./uiFlowRoutes');
const appController = require('./appController');
const loginController = require('./loginController');

const router = express.Router();

router.get('/', appController.getAppInfo);
router.get('/health', appController.health);
router.post('/login', loginController.login);
router.use('/posts', postRoutes);
router.use('/teachers', teacherRoutes);
router.use('/students', studentRoutes);
router.use('/', uiFlowRoutes);

module.exports = router;
