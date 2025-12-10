const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  headers: {
    id: {
      type: String,
      unique: true,
      required: true
    },
    de: {
      type: String,
      required: true
    },
    para: {
      type: String,
      required: true
    },
    asunto: {
      type: String,
      required: true
    },
    stamp: {
      type: Date,
      default: Date.now
    }
  },
  body: {
    contenido: {
      type: String,
      required: true
    },
    adjunto: {
      type: String,
      default: null
    },
    token: {
      type: String,
      default: null
    }
  }
}, { timestamps: false });

// Índices para optimizar búsquedas
messageSchema.index({ 'headers.de': 1, 'headers.stamp': -1 });
messageSchema.index({ 'headers.para': 1, 'headers.stamp': -1 });
messageSchema.index({ 'headers.id': 1 }, { unique: true });

module.exports = mongoose.model('Message', messageSchema);
