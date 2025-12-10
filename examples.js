// Este archivo contiene ejemplos de cómo usar la API de TextME

// 1. OBTENER CABECERAS DE MENSAJES DE UN USUARIO
// GET /api/messages/user/usuario1@example.com

const ejemplo1 = `
curl -X GET http://localhost:5000/api/messages/user/usuario1@example.com
`;

// 2. OBTENER UN MENSAJE COMPLETO
// GET /api/message/:id

const ejemplo2 = `
curl -X GET http://localhost:5000/api/message/msg_12345
`;

// 3. CREAR UN NUEVO MENSAJE
// POST /api/message

const ejemplo3 = `
curl -X POST http://localhost:5000/api/message \\
  -H "Content-Type: application/json" \\
  -d '{
    "de": "usuario1@example.com",
    "para": "usuario2@example.com",
    "asunto": "Reunión de proyecto",
    "contenido": "Hola, quería confirmar la reunión para mañana a las 10 AM",
    "adjunto": "https://example.com/images/documento.jpg",
    "token": "eyJhbGc..."
  }'
`;

// EJEMPLOS CON JavaScript fetch()

// 1. Obtener mensajes de un usuario
async function obtenerMensajesUsuario(email) {
  try {
    const response = await fetch(`http://localhost:5000/api/messages/user/${email}`);
    const data = await response.json();
    console.log('Mensajes del usuario:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 2. Obtener mensaje completo
async function obtenerMensaje(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/message/${id}`);
    const data = await response.json();
    console.log('Mensaje completo:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 3. Crear nuevo mensaje
async function crearMensaje(de, para, asunto, contenido, adjunto = null, token = null) {
  try {
    const response = await fetch('http://localhost:5000/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        de,
        para,
        asunto,
        contenido,
        adjunto,
        token
      })
    });
    const data = await response.json();
    console.log('Mensaje creado:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Pruebas
obtenerMensajesUsuario('usuario1@example.com');
obtenerMensaje('msg_12345');
crearMensaje('usuario1@example.com', 'usuario2@example.com', 'Prueba', 'Hola mundo');
