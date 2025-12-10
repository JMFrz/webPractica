const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Importar modelo
const Message = require('./models/Message');

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB');

    // Limpiar colección anterior (opcional)
    await Message.deleteMany({});
    console.log('Colección limpiada');

    // Crear mensajes de ejemplo
    const messages = [
      {
        headers: {
          id: 'msg_001',
          de: 'juan@example.com',
          para: 'maria@example.com',
          asunto: 'Proyecto Final',
          stamp: new Date('2025-12-08T14:30:00Z')
        },
        body: {
          contenido: 'Hola María, ¿Cómo va el proyecto? Necesito que revises la base de datos.',
          adjunto: 'https://example.com/images/database_design.jpg',
          token: null
        }
      },
      {
        headers: {
          id: 'msg_002',
          de: 'maria@example.com',
          para: 'juan@example.com',
          asunto: 'Re: Proyecto Final',
          stamp: new Date('2025-12-08T15:45:00Z')
        },
        body: {
          contenido: 'Hola Juan, ya revisé el diseño. Se ve bien. Podemos mejorar los índices.',
          adjunto: null,
          token: null
        }
      },
      {
        headers: {
          id: 'msg_003',
          de: 'juan@example.com',
          para: 'carlos@example.com',
          asunto: 'Reunión de equipo',
          stamp: new Date('2025-12-08T16:00:00Z')
        },
        body: {
          contenido: 'Carlos, te invito a la reunión de equipo de mañana a las 10 AM.',
          adjunto: null,
          token: null
        }
      },
      {
        headers: {
          id: 'msg_004',
          de: 'carlos@example.com',
          para: 'juan@example.com',
          asunto: 'Re: Reunión de equipo',
          stamp: new Date('2025-12-08T16:30:00Z')
        },
        body: {
          contenido: 'Confirmado. Estaré en la reunión. ¿Dónde será?',
          adjunto: null,
          token: null
        }
      },
      {
        headers: {
          id: 'msg_005',
          de: 'maria@example.com',
          para: 'juan@example.com',
          asunto: 'Documentación completada',
          stamp: new Date('2025-12-08T17:00:00Z')
        },
        body: {
          contenido: 'Juan, la documentación de la API está lista. Reviisa DATABASE_DESIGN.md',
          adjunto: 'https://example.com/docs/api_documentation.pdf',
          token: null
        }
      }
    ];

    // Insertar mensajes
    await Message.insertMany(messages);
    console.log(`${messages.length} mensajes insertados exitosamente`);

    // Mostrar estadísticas
    const count = await Message.countDocuments();
    console.log(`Total de mensajes en la BD: ${count}`);

    // Desconectar
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
