const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/auth.model');
const Organization = require('../models/organization.model');

// User Signup
exports.signup = async (req, res) => {
    try {
        // Check if organization details are provided
        if (!req.body.organization) {
            return res.status(400).json({ message: 'Organization details are required' });
        }

        // Create organization first
        const organization = await Organization.create({
            name: req.body.organization.name,
            description: req.body.organization.description || '',
            contactEmail: req.body.email, // Use user email as default org contact
            contactPhone: req.body.organization.contactPhone || '',
            address: req.body.organization.address || ''
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create user with reference to organization
        const user = await User.create({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
            organizationId: organization._id,
            role: 'admin' // First user is admin by default
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                organizationId: organization._id,
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Return user data (without password) and token
        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                organizationId: organization._id,
                role: user.role
            },
            organization: {
                id: organization._id,
                name: organization.name
            },
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ message: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email }).populate('organizationId', 'name');
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if organization exists
        if (!user.organizationId) {
            console.error('User has no associated organization:', user._id);
            return res.status(500).json({ message: 'User account has no organization. Please contact support.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                organizationId: user.organizationId._id || user.organizationId,
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Return user data and token
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name || '',
                organizationId: user.organizationId._id || user.organizationId,
                organizationName: user.organizationId.name || 'Your Organization',
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Verify token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};