const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cycleSchema = new Schema({
  label: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
});

const Cycle = mongoose.model('Cycle', cycleSchema);

module.exports = Cycle;