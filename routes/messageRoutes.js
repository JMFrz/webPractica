const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('../middlewares/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Config Cloudinary (usar CLOUDINARY_URL o variables específicas)
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
const upload = multer({ storage });

// Sube imagen a Cloudinary si existe archivo
async function maybeUploadImage(file) {
  if (!file) return null;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'textme' }, (err, result) => {
      if (err) return reject(err);
      return resolve(result.secure_url);
    });
    stream.end(file.buffer);
  });
}

// Proteger todas las rutas de este router
router.use(requireAuth);

// 1. Obtener cabeceras de mensajes recibidos y enviados por un usuario (orden descendente por fecha)
router.get('/messages/user/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Buscar mensajes donde el usuario es remitente O destinatario
    const messages = await Message.find({
      $or: [
        { 'headers.de': email },
        { 'headers.para': email }
      ]
    }).sort({ 'headers.stamp': -1 });

    // Retornar solo las cabeceras
    const headers = messages.map(msg => ({
      id: msg.headers.id,
      de: msg.headers.de,
      para: msg.headers.para,
      asunto: msg.headers.asunto,
      stamp: msg.headers.stamp
    }));

    res.json({
      success: true,
      count: headers.length,
      data: headers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 2. Obtener datos completos de un mensaje por su ID
router.get('/message/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findOne({ 'headers.id': id });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Mensaje no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        headers: message.headers,
        body: message.body
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. Crear un nuevo mensaje
router.post('/message', upload.single('adjunto'), async (req, res) => {
  try {
    const { de, para, asunto, contenido, token } = req.body;

    // Validar campos requeridos
    if (!de || !para || !asunto || !contenido) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: de, para, asunto, contenido'
      });
    }

    // Crear ID único para el mensaje
    const messageId = `msg_${uuidv4()}`;

    // Subir imagen si viene archivo
    let adjuntoUrl = req.body.adjunto || null;
    if (req.file) {
      adjuntoUrl = await maybeUploadImage(req.file);
    }

    const newMessage = new Message({
      headers: {
        id: messageId,
        de: de,
        para: para,
        asunto: asunto,
        stamp: new Date()
      },
      body: {
        contenido: contenido,
        adjunto: adjuntoUrl,
        token: token || null
      }
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Mensaje creado exitosamente',
      data: {
        id: messageId,
        de: de,
        para: para,
        asunto: asunto,
        stamp: newMessage.headers.stamp
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
