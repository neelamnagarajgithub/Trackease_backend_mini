const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        required: true,
        trim: true
    },
    contactPhone: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization; 