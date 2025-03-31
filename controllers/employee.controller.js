const Employee = require('../models/employee.model');

// Create a new employee
exports.createEmployee = async (req, res) => {
    try {
        console.log('Creating employee with data:', req.body);
        const employee = await Employee.create(req.body);
        console.log('Employee created successfully:', employee);
        res.status(201).send(employee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(400).send({ message: error.message });
    }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get an employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send();
        }
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update an employee by ID
exports.updateEmployeeById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'position', 'department', 'email', 'hireDate', 'salary'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send();
        }

        updates.forEach((update) => (employee[update] = req.body[update]));
        await employee.save();
        res.status(200).send(employee);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete an employee by ID
exports.deleteEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).send();
        }
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};