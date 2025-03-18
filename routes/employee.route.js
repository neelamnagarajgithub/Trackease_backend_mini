const express = require('express');
const employeeController = require('../controllers/employee.controller');

const employeerouter = express.Router();

// Create a new employee
employeerouter.post('/employees', employeeController.createEmployee);

// Get all employees
employeerouter.get('/employees', employeeController.getAllEmployees);

// Get an employee by ID
employeerouter.get('/employees/:id', employeeController.getEmployeeById);

// Update an employee by ID
employeerouter.patch('/employees/:id', employeeController.updateEmployeeById);

// Delete an employee by ID
employeerouter.delete('/employees/:id', employeeController.deleteEmployeeById);

module.exports = employeerouter