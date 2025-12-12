const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  googleId: {
    type: String,
    default: null
  },
  githubId: {
    type: String,
    default: null
  },
  nombre: {
    type: String,
    default: null
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema, 'User');
