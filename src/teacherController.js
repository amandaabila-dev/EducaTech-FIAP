const teacherService = require('./teacherService');

async function listTeachers(req, res, next) {
  try {
    res.json(await teacherService.findAll(req.query));
  } catch (error) {
    next(error);
  }
}

async function getTeacherById(req, res, next) {
  try {
    res.json(await teacherService.findById(req.params.id));
  } catch (error) {
    next(error);
  }
}

async function createTeacher(req, res, next) {
  try {
    res.status(201).json(await teacherService.create(req.body));
  } catch (error) {
    next(error);
  }
}

async function updateTeacher(req, res, next) {
  try {
    res.json(await teacherService.update(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function deleteTeacher(req, res, next) {
  try {
    await teacherService.delete(req.params.id, req.user);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
