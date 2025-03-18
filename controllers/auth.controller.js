const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/auth.model');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
};

//200-ok-get,patch
//201-post
//404-error
//204-del
////401

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ _id: user._id.toString(),name:user.name,email:user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ "token": token });
        console.log(token)
    } catch (error) {
        res.status(400).send(error);
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