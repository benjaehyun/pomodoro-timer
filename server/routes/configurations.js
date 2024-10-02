const express = require('express');
const router = express.Router();
const configController = require('../controllers/configurationController');
const auth = require('../middleware/auth');

router.use(auth);  // All routes require authentication

router.get('/', auth, configController.getConfigurations);
router.post('/', auth, configController.createConfiguration);
router.put('/:id', auth, configController.updateConfiguration);
router.delete('/:id', auth, configController.deleteConfiguration);

module.exports = router;