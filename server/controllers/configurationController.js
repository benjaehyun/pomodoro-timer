const Configuration = require('../models/configuration.model');

module.exports = {
  getConfigurations,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration
};

async function getConfigurations(req, res) {
  try {
    const configurations = await Configuration.find({ user: req.user.userId });
    res.status(200).json(configurations);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
}

async function createConfiguration(req, res) {
  try {
    const newConfiguration = new Configuration({
      user: req.user.userId,
      name: req.body.name,
      cycles: req.body.cycles
    });
    
    await newConfiguration.save();
    res.status(201).json(newConfiguration);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
}

async function updateConfiguration(req, res) {
  try {
    const updatedConfiguration = await Configuration.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { name: req.body.name, cycles: req.body.cycles },
      { new: true }
    );
    
    if (!updatedConfiguration) {
      return res.status(404).json('Configuration not found');
    }
    
    res.status(200).json(updatedConfiguration);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
}

async function deleteConfiguration(req, res) {
  try {
    const deletedConfiguration = await Configuration.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.userId 
    });
    
    if (!deletedConfiguration) {
      return res.status(404).json('Configuration not found');
    }
    
    res.status(200).json('Configuration deleted successfully');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
}