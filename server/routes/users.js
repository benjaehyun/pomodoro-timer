const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/me', auth, userCtrl.getMe);
router.put('/quick-access', auth, userCtrl.updateQuickAccessConfigurations);

module.exports = router;