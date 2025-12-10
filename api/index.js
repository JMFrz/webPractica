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

// Importar rutas existentes
const messageRoutes = require('../routes/messageRoutes');
const userRoutes = require('../routes/userRoutes');
const authRoutes = require('../routes/authRoutes');

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
app.use('/api', messageRoutes);
app.use('/api', userRoutes);

// Ruta raíz (info)
app.get('/', (req, res) => {
  res.json({
    message: 'TextME - Aplicación de Mensajería Electrónica (Vercel)',
    version: '1.0.0',
    endpoints: {
      'GET /api/messages/user/:email': 'Obtener cabeceras de mensajes de un usuario',
      'GET /api/message/:id': 'Obtener mensaje completo por ID',
      'POST /api/message': 'Crear nuevo mensaje',
      'POST /api/auth/google': 'Login con Google (idToken)',
      'POST /api/auth/github': 'Login con GitHub (code)',
      'GET /api/auth/me': 'Obtener datos del usuario autenticado',
      'POST /api/users': 'Crear usuario',
      'GET /api/users': 'Listar usuarios',
      'GET /api/users/:id': 'Obtener usuario por ID',
      'GET /api/users/email/:email': 'Obtener usuario por email'
    }
  });
});

module.exports = app;
module.exports.handler = serverless(app);
