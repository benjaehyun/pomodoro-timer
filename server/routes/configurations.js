import express from 'express';
import auth from '../middleware/auth';
import * as configController from '../controllers/configurationController';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', configController.getConfigurations);
router.post('/', configController.createConfiguration);
router.put('/:id', configController.updateConfiguration);
router.delete('/:id', configController.deleteConfiguration);

export default router;