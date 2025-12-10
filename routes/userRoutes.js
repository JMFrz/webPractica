const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas de usuarios
router.use(requireAuth);

// Crear usuario
router.post('/users', async (req, res) => {
  try {
    const { email, googleId, nombre } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Campo requerido: email' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: 'El usuario ya existe' });
    }

    const user = await User.create({ email, googleId: googleId || null, nombre: nombre || null });

    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Listar usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ fechaRegistro: -1 });
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener usuario por ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener usuario por email
router.get('/users/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
