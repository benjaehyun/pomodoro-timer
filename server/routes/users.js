const router = require('express').Router();
const usersCtrl = require('../controllers/userController');

// GET /api/users
router.get('/', usersCtrl.getUsers);

// POST /api/users (create a new user)
router.post('/', usersCtrl.createUser);

// Add other routes as needed

module.exports = router;