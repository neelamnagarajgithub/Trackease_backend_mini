const mongoose = require('mongoose');
const validator = require('validator');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        }
    },
    hireDate: {
        type: Date,
        required: true
    },
    salary: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Salary must be a positive number');
            }
        }
    },
    contact: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isMobilePhone(value, 'any')) {
                throw new Error('Invalid phone number format');
            }
        }
    },
    joiningDate: {
        type: Date,
        required: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;