const Employee = require('../models/employee.model');

// Create a new employee
exports.createEmployee = async (req, res) => {
    try {
        // Add organization ID from authenticated user
        const employeeData = {
            ...req.body,
            organizationId: req.organizationId
        };

        console.log('Creating employee with data:', employeeData);
        const employee = await Employee.create(employeeData);
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
        // Only get employees for the user's organization
        const employees = await Employee.find({ organizationId: req.organizationId });
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get an employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findOne({ 
            _id: req.params.id,
            organizationId: req.organizationId
        });
        
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update an employee by ID
exports.updateEmployeeById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'position', 'department', 'email', 'hireDate', 'salary', 'contact', 'phone', 'address'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        // Ensure employee belongs to user's organization
        const employee = await Employee.findOne({
            _id: req.params.id,
            organizationId: req.organizationId
        });
        
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
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
        // Ensure employee belongs to user's organization
        const employee = await Employee.findOneAndDelete({
            _id: req.params.id,
            organizationId: req.organizationId
        });
        
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};