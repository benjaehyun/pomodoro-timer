const express = require('express');
const router = express.Router();
const cyclesCtrl = require('../../server/controllers/cyclesController');

router.get('/', cyclesCtrl.getCycles);
router.post('/add', cyclesCtrl.addCycle);
router.post('/updateOrder', cyclesCtrl.updateCycleOrder);

module.exports = router;