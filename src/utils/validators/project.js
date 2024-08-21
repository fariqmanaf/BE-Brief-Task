const { body } = require('express-validator');

const validateProject = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required')
];

module.exports = { validateProject };