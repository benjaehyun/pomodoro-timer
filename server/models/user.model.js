import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3
  },
  quickAccessConfigurations: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Add method to safely return user data without sensitive fields
userSchema.methods.toSafeObject = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    displayName: this.displayName,
    quickAccessConfigurations: this.quickAccessConfigurations
  };
};

// Handle the case where the model might already be compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;