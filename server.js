const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

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
app.use('/api', messageRoutes);
app.use('/api', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'TextME - Aplicación de Mensajería Electrónica',
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
