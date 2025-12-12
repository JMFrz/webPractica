const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Evitar creación automática de colecciones no usadas
mongoose.set('autoCreate', false);

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Rutas
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', reviewRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'ReViews - Aplicación de Reseñas con Mapas',
    version: '1.0.0',
    endpoints: {
      'GET /api/reviews': 'Obtener listado de reseñas',
      'GET /api/review/:id': 'Obtener detalle de reseña',
      'POST /api/review': 'Crear nueva reseña',
      'POST /api/auth/google': 'Login con Google (idToken)',
      'POST /api/auth/github': 'Login con GitHub (code)',
      'GET /api/auth/me': 'Obtener datos del usuario autenticado',
      'POST /api/users': 'Crear usuario',
      'GET /api/users/email/:email': 'Obtener usuario por email'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
