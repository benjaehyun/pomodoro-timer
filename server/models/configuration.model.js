const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  id: String,
  label: String,
  duration: Number,
  note: String
});

const ConfigurationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cycles: [CycleSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Configuration', ConfigurationSchema);