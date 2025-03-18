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
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'pending'],
        default: 'active'
    }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;