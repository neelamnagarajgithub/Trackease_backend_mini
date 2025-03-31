const express = require('express');
const employeeController = require('../controllers/employee.controller');

const employeerouter = express.Router();

// Create a new employee
employeerouter.post('/', employeeController.createEmployee);

// Get all employees
employeerouter.get('/', employeeController.getAllEmployees);

// Get an employee by ID
employeerouter.get('/:id', employeeController.getEmployeeById);

// Update an employee by ID
employeerouter.patch('/:id', employeeController.updateEmployeeById);

// Delete an employee by ID
employeerouter.delete('/:id', employeeController.deleteEmployeeById);

module.exports = employeerouter