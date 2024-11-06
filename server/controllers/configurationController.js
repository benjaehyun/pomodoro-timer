import Configuration from '../models/configuration.model';

export async function getConfigurations(req, res) {
  try {
    const configurations = await Configuration.find({ user: req.user.userId });
    res.status(200).json(configurations);
  } catch (error) {
    console.error('Error fetching configurations:', error);
    res.status(500).json({ 
      message: 'Error fetching configurations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function createConfiguration(req, res) {
  try {
    const { name, cycles } = req.body;
    
    if (!name || !cycles || !Array.isArray(cycles) || cycles.length === 0) {
      return res.status(400).json({ message: 'Invalid configuration data' });
    }

    // Check for duplicate names for this user
    const existingConfig = await Configuration.findOne({ 
      user: req.user.userId,
      name: name 
    });

    if (existingConfig) {
      return res.status(400).json({ message: 'Configuration name already exists' });
    }

    const newConfiguration = new Configuration({
      user: req.user.userId,
      name,
      cycles,
    });
    
    await newConfiguration.save();
    res.status(201).json(newConfiguration);
  } catch (error) {
    console.error('Error creating configuration:', error);
    res.status(400).json({ 
      message: 'Error creating configuration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function updateConfiguration(req, res) {
  try {
    const { name, cycles } = req.body;
    
    if (!name || !cycles || !Array.isArray(cycles) || cycles.length === 0) {
      return res.status(400).json({ message: 'Invalid configuration data' });
    }

    // Check for duplicate names but exclude current configuration
    const existingConfig = await Configuration.findOne({ 
      user: req.user.userId,
      name: name,
      _id: { $ne: req.params.id }
    });

    if (existingConfig) {
      return res.status(400).json({ message: 'Configuration name already exists' });
    }

    const updatedConfiguration = await Configuration.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { name, cycles, lastModified: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedConfiguration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    
    res.status(200).json(updatedConfiguration);
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(400).json({ 
      message: 'Error updating configuration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function deleteConfiguration(req, res) {
  try {
    const deletedConfiguration = await Configuration.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.userId 
    });
    
    if (!deletedConfiguration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    
    res.status(200).json({ message: 'Configuration deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting configuration:', error);
    res.status(400).json({ 
      message: 'Error deleting configuration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}