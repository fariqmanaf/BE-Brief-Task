const express = require('express')

const router = express.Router();

const verifyToken = require('../middleware/auth');

const authController = require('../controller/AuthController');
const userController = require('../controller/UserController');
const ProjectController = require('../controller/ProjectController');
const TaskController = require('../controller/TaskController');

const { validateRegister, validateLogin } = require('../utils/validators/auth');
const { validateUser } = require('../utils/validators/user');
const { validateProject } = require('../utils/validators/project');
const { validateTask } = require('../utils/validators/task');

const upload = require('../utils/validators/image');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

router.get('/admin/users', verifyToken, userController.findUsers);
router.post('/admin/users', verifyToken, validateUser, userController.createUser);
router.get('/admin/users/:id', verifyToken, userController.findUserById);
router.put('/admin/users/:id', verifyToken, upload.single("photo"), validateUser, userController.updateUser);
router.delete('/admin/users/:id', verifyToken, userController.deleteUser);

router.get('/project', verifyToken, ProjectController.findProject);
router.post('/project', verifyToken, validateProject, ProjectController.createProject);
router.get('/project/:id', verifyToken, ProjectController.findProjectById);
router.put('/project/:id', verifyToken, validateProject, ProjectController.updateProject);
router.delete('/project/:id', verifyToken, ProjectController.deleteProject);

router.get('/project/:projectId/task', verifyToken, TaskController.findTask);
router.post('/project/:projectId/task', verifyToken, validateTask, TaskController.createTask);
router.get('/project/:projectId/task/:id', verifyToken, TaskController.findTaskById);
router.put('/project/:projectId/task/:id', verifyToken, validateTask, TaskController.updateTask);
router.delete('/project/:projectId/task/:id', verifyToken, TaskController.deleteTask);

module.exports = router