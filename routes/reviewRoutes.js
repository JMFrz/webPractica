const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { requireAuth } = require('../middlewares/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Config Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Función para hacer geocoding con OpenStreetMap Nominatim
async function geocodeAddress(address) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      }
    });
    
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lon: parseFloat(result.lon),
        lat: parseFloat(result.lat)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}

// Función para subir imágenes a Cloudinary
async function uploadImagesToCloudinary(files) {
  if (!files || files.length === 0) return [];
  
  const urls = [];
  for (const file of files) {
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'reviews', resource_type: 'auto' },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      urls.push(result.secure_url);
    } catch (error) {
      console.error('Upload error:', error.message);
    }
  }
  return urls;
}

// Proteger todas las rutas
router.use(requireAuth);

// GET /api/reviews - Obtener listado de todas las reseñas
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ creadoEn: -1 });
    
    // Mapear a formato de respuesta
    const data = reviews.map(review => ({
      id: review._id,
      nombre: review.nombre,
      direccion: review.direccion,
      coordenadas: {
        lon: review.coordenadas.coordinates[0],
        lat: review.coordenadas.coordinates[1]
      },
      valoracion: review.valoracion
    }));
    
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/review/:id - Obtener detalle de una reseña
router.get('/review/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Reseña no encontrada'
      });
    }
    
    // Decodificar token para obtener información
    let tokenInfo = null;
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
      tokenInfo = jwt.verify(review.token, JWT_SECRET);
    } catch (e) {
      // Token expirado o inválido, pero lo mostramos igual
      tokenInfo = { expired: true };
    }
    
    res.json({
      success: true,
      data: {
        id: review._id,
        nombre: review.nombre,
        direccion: review.direccion,
        coordenadas: {
          lon: review.coordenadas.coordinates[0],
          lat: review.coordenadas.coordinates[1]
        },
        valoracion: review.valoracion,
        autorEmail: review.autorEmail,
        autorNombre: review.autorNombre,
        token: review.token,
        tokenEmisión: review.tokenEmisión,
        tokenCaducidad: review.tokenCaducidad,
        imagenes: review.imagenes,
        creadoEn: review.creadoEn
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/review - Crear nueva reseña
router.post('/review', upload.array('imagenes', 5), async (req, res) => {
  try {
    const { nombre, direccion, valoracion } = req.body;
    
    if (!nombre || !direccion || valoracion === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos obligatorios: nombre, dirección, valoración'
      });
    }
    
    // Validar valoración
    const val = parseFloat(valoracion);
    if (isNaN(val) || val < 0 || val > 5) {
      return res.status(400).json({
        success: false,
        error: 'Valoración debe estar entre 0 y 5'
      });
    }
    
    // Hacer geocoding de la dirección
    const coords = await geocodeAddress(direccion);
    if (!coords) {
      return res.status(400).json({
        success: false,
        error: 'No se pudo geocodificar la dirección. Verifica que sea correcta.'
      });
    }
    
    // Subir imágenes
    const imagenes = await uploadImagesToCloudinary(req.files);
    
    // Obtener información del token
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
    let tokenInfo;
    try {
      tokenInfo = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido o expirado'
      });
    }
    
    // Decodificar token para obtener tiempos
    const decoded = jwt.decode(token);
    const ahora = new Date();
    const tokenEmisión = ahora;
    const tokenCaducidad = new Date(decoded.exp * 1000);
    
    // Crear reseña
    const review = await Review.create({
      nombre,
      direccion,
      coordenadas: {
        type: 'Point',
        coordinates: [coords.lon, coords.lat]
      },
      valoracion: val,
      autorEmail: tokenInfo.email,
      autorNombre: tokenInfo.nombre || null,
      token,
      tokenEmisión,
      tokenCaducidad,
      imagenes
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: review._id,
        nombre: review.nombre,
        direccion: review.direccion,
        coordenadas: {
          lon: review.coordenadas.coordinates[0],
          lat: review.coordenadas.coordinates[1]
        },
        valoracion: review.valoracion
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
