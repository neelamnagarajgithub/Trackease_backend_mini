const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all dashboard routes
router.get('/', verifyToken, getDashboardData);

module.exports = router;