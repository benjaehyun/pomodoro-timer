import mongoose from 'mongoose';

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
  cycles: [CycleSchema],
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastModified on save
ConfigurationSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Handle the case where the model might already be compiled
const Configuration = mongoose.models.Configuration || mongoose.model('Configuration', ConfigurationSchema);

export default Configuration;