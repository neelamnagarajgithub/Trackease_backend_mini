const express = require('express');
const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

// Register a new user
authRouter.post('/register', authController.register);

// Login a user
authRouter.post('/login', authController.login);

module.exports = authRouter;