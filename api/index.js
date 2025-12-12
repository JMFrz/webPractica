const serverless = require('serverless-http');
const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Cargar .env en desarrollo local (en Vercel se inyectan variables desde el panel)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

// Evitar creación automática de colecciones no usadas
mongoose.set('autoCreate', false);

// Importar rutas existentes
const userRoutes = require('../routes/userRoutes');
const authRoutes = require('../routes/authRoutes');
const reviewRoutes = require('../routes/reviewRoutes');

// Conexión a MongoDB (reutiliza conexión si ya está abierta)
async function connectDB() {
  if (mongoose.connection.readyState === 1) return; // conectado
  if (mongoose.connection.readyState === 2) return; // conectando
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado (serverless)');
  } catch (err) {
    console.error('Error conectando a MongoDB (serverless):', err.message);
  }
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Asegurar conexión en cada invocación (mongoose mantiene pool entre invocaciones)
app.use(async (req, res, next) => {
  await connectDB();
  return next();
});

// Rutas
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', reviewRoutes);

// Ruta raíz (info)
app.get('/', (req, res) => {
  res.json({
    message: 'ReViews - Aplicación de Reseñas con Mapas (Vercel)',
    version: '2.0.0',
    endpoints: {
      'GET /api/reviews': 'Obtener listado de reseñas',
      'GET /api/review/:id': 'Obtener detalle de reseña',
      'POST /api/review': 'Crear nueva reseña',
      'POST /api/auth/google': 'Login con Google (idToken)',
      'POST /api/auth/github': 'Login con GitHub (code)',
      'GET /api/auth/me': 'Obtener datos del usuario autenticado'
    }
  });
});

module.exports = app;
module.exports.handler = serverless(app);
