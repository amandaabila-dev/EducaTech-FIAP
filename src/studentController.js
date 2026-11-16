const studentService = require('./studentService');

async function listStudents(req, res, next) {
  try {
    res.json(await studentService.findAll(req.query));
  } catch (error) {
    next(error);
  }
}

async function getStudentById(req, res, next) {
  try {
    res.json(await studentService.findById(req.params.id));
  } catch (error) {
    next(error);
  }
}

async function createStudent(req, res, next) {
  try {
    res.status(201).json(await studentService.create(req.body));
  } catch (error) {
    next(error);
  }
}

async function updateStudent(req, res, next) {
  try {
    res.json(await studentService.update(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function deleteStudent(req, res, next) {
  try {
    await studentService.delete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
