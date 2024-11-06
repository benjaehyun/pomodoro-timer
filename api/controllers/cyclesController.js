const Cycle = require('../models/cycle.model');

module.exports = {
  getCycles,
  addCycle,
  updateCycleOrder
};

async function getCycles(req, res) {
  try {
    const cycles = await Cycle.find().sort('order');
    res.json(cycles);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
}

async function addCycle(req, res) {
  try {
    const { label, duration } = req.body;
    const count = await Cycle.countDocuments();
    
    const newCycle = new Cycle({
      label,
      duration,
      order: count
    });

    await newCycle.save();
    res.json('Cycle added!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
}

async function updateCycleOrder(req, res) {
  try {
    const { cycles } = req.body;
    
    const updates = cycles.map((cycle, index) => ({
      updateOne: {
        filter: { _id: cycle._id },
        update: { $set: { order: index } }
      }
    }));

    await Cycle.bulkWrite(updates);
    res.json('Cycle order updated!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
}