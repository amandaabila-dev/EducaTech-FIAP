const express = require('express');
const { requireAuth } = require('./authMiddleware');
const studentController = require('./studentController');

const router = express.Router();

router.get('/', requireAuth, studentController.listStudents);
router.post('/', requireAuth, studentController.createStudent);
router.get('/:id', requireAuth, studentController.getStudentById);
router.put('/:id', requireAuth, studentController.updateStudent);
router.delete('/:id', requireAuth, studentController.deleteStudent);

module.exports = router;
