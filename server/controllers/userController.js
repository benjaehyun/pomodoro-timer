const User = require('../models/user.model');

module.exports = {
    getUsers,
    createUser,
    // Add other functions as needed
}

async function getUsers(req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json('Error: ' + error);
    }
}

async function createUser(req, res) {
    try {
        const newUser = await User.create(req.body);
        res.json('User added!');
    } catch (error) {
        console.log(error);
        if (error.code === 11000) { // MongoDB duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

// Add other functions as needed