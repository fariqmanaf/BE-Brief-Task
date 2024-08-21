const { body } = require('express-validator');

const prisma = require('../../../prisma/client');

const validateTask = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required')
];

module.exports = { validateTask };