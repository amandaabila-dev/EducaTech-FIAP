const express = require('express');
const { requireAuth } = require('./authMiddleware');
const teacherController = require('./teacherController');

const router = express.Router();

router.get('/', requireAuth, teacherController.listTeachers);
router.post('/', requireAuth, teacherController.createTeacher);
router.get('/:id', requireAuth, teacherController.getTeacherById);
router.put('/:id', requireAuth, teacherController.updateTeacher);
router.delete('/:id', requireAuth, teacherController.deleteTeacher);

module.exports = router;
