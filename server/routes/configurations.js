const express = require('express');
const router = express.Router();
const configController = require('../controllers/configurationController');
const auth = require('../middleware/auth');

router.use(auth);  // All routes require authentication

router.get('/', configController.getConfigurations);
router.post('/', configController.createConfiguration);
router.put('/:id', configController.updateConfiguration);
router.delete('/:id', configController.deleteConfiguration);

module.exports = router;