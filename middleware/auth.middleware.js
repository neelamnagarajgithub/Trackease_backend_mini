const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config.env' });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication required. Invalid token format.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user data to request
        req.user = decoded;
        
        // Proceed to the protected route
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

module.exports = { verifyToken }; 