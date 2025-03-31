const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'on-hold', 'completed', 'cancelled'],
        default: 'active'
    },
    assignedEmployees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    totalTasks: {
        type: Number,
        default: 0
    },
    completedTasks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;