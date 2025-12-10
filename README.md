# TextME - Aplicación de Mensajería Electrónica

Aplicación web de mensajería basada en Node.js, Express y MongoDB.

## Instalación

```bash
npm install
```

## Configuración

Edita el archivo `.env` con tu URI de MongoDB:

```
MONGODB_URI=mongodb://localhost:27017/textme
PORT=5000
NODE_ENV=development
```

## Ejecución

### 1. Instalar MongoDB localmente

Descarga e instala MongoDB Community Edition desde: https://www.mongodb.com/try/download/community

### 2. Iniciar MongoDB

```bash
# En Windows (si está instalado como servicio)
net start MongoDB

# O ejecutar directamente
mongod
```

### 3. Cargar datos de ejemplo (opcional)

```bash
node seedDatabase.js
```

### 4. Iniciar la aplicación

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

La aplicación se ejecutará en `http://localhost:5000`

## Endpoints

### 1. Obtener mensajes de un usuario
```
GET /api/messages/user/:email
```
Obtiene cabeceras de todos los mensajes (enviados y recibidos) por un usuario, ordenados por fecha descendente.

**Respuesta:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "msg_12345",
      "de": "usuario1@example.com",
      "para": "usuario2@example.com",
      "asunto": "Reunión de proyecto",
      "stamp": "2025-12-08T14:30:00.000Z"
    }
  ]
}
```

### 2. Obtener mensaje completo
```
GET /api/message/:id
```
Obtiene los datos completos (cabecera y cuerpo) de un mensaje específico.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "headers": {
      "id": "msg_12345",
      "de": "usuario1@example.com",
      "para": "usuario2@example.com",
      "asunto": "Reunión de proyecto",
      "stamp": "2025-12-08T14:30:00.000Z"
    },
    "body": {
      "contenido": "Hola, quería confirmar la reunión...",
      "adjunto": "https://example.com/images/documento.jpg",
      "token": null
    }
  }
}
```

### 3. Crear nuevo mensaje
```
POST /api/message
```

**Body:**
```json
{
  "de": "usuario1@example.com",
  "para": "usuario2@example.com",
  "asunto": "Reunión de proyecto",
  "contenido": "Hola, quería confirmar la reunión...",
  "adjunto": "https://example.com/images/documento.jpg",
  "token": "eyJhbGc..."
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Mensaje creado exitosamente",
  "data": {
    "id": "msg_12345",
    "de": "usuario1@example.com",
    "para": "usuario2@example.com",
    "asunto": "Reunión de proyecto",
    "stamp": "2025-12-08T14:30:00.000Z"
  }
}
```

## Estructura de la Base de Datos

### Colección: messages

```javascript
{
  _id: ObjectId,
  headers: {
    id: String (único),
    de: String,
    para: String,
    asunto: String,
    stamp: Date
  },
  body: {
    contenido: String,
    adjunto: String (opcional),
    token: String (opcional)
  }
}
```

### Índices
- `headers.de` y `headers.stamp` (descendente)
- `headers.para` y `headers.stamp` (descendente)
- `headers.id` (único)

## Requisitos Cumplidos

✅ **Almacenamiento (2 puntos)**
- Base de datos MongoDB no relacional
- Estructura con headers y body según especificación

✅ **Funcionalidad Básica (2 puntos)**
- Obtener cabeceras de mensajes enviados/recibidos por usuario
- Obtener datos completos de un mensaje por ID
- Crear nuevos mensajes
