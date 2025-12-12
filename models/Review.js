const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // Datos del establecimiento
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    direccion: {
      type: String,
      required: true,
      trim: true
    },
    coordenadas: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lon, lat]
        required: true
      }
    },
    
    // Valoración
    valoracion: {
      type: Number,
      min: 0,
      max: 5,
      required: true
    },
    
    // Datos del autor (del token JWT)
    autorEmail: {
      type: String,
      required: true
    },
    autorNombre: {
      type: String
    },
    
    // Token y timestamps
    token: {
      type: String,
      required: true
    },
    tokenEmisión: {
      type: Date,
      required: true
    },
    tokenCaducidad: {
      type: Date,
      required: true
    },
    
    // Imágenes (URLs de Cloudinary)
    imagenes: [
      {
        type: String,
        trim: true
      }
    ],
    
    // Información de creación
    creadoEn: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Índice geoespacial para búsquedas por ubicación
reviewSchema.index({ 'coordenadas': '2dsphere' });

module.exports = mongoose.model('Review', reviewSchema, 'Review');
