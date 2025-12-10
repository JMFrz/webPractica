# Documentación de la Base de Datos TextME

## Diseño de Entidades

### Colección: `messages`

La aplicación utiliza una **base de datos no relacional (MongoDB)** con una única colección llamada `messages` que almacena todos los mensajes de la aplicación.

#### Estructura del Documento

```javascript
{
  _id: ObjectId,                    // ID interno de MongoDB
  headers: {
    id: String,                     // ID único del mensaje (ej: msg_uuid)
    de: String,                     // Email o Google ID del remitente
    para: String,                   // Email o Google ID del destinatario
    asunto: String,                 // Asunto/título del mensaje
    stamp: Date                      // Fecha y hora de creación (auto-asignada)
  },
  body: {
    contenido: String,              // Contenido del mensaje (sin límite de tamaño)
    adjunto: String,                // URL de imagen adjunta (opcional)
    token: String                   // Token de autenticación (opcional, para Parcial 3)
  }
}
```

#### Ejemplo de Documento

```json
{
  "_id": ObjectId("65700abcdef1234567890123"),
  "headers": {
    "id": "msg_550e8400-e29b-41d4-a716-446655440000",
    "de": "usuario1@example.com",
    "para": "usuario2@example.com",
    "asunto": "Reunión de proyecto",
    "stamp": ISODate("2025-12-08T14:30:00.000Z")
  },
  "body": {
    "contenido": "Hola, quería confirmar la reunión para mañana a las 10 AM. Favor de confirmar asistencia.",
    "adjunto": "https://example.com/images/documento.pdf",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Justificación del Diseño

### 1. **Base de Datos No Relacional (MongoDB)**
- **Razón:** Flexibilidad en la estructura de datos
- **Ventaja:** Facilita la evolución del esquema sin migrations complejas
- **Caso de uso:** Los campos `adjunto` y `token` son opcionales, lo que encaja naturalmente en documentos JSON

### 2. **Estructura Anidada (Headers + Body)**
- **Headers:** Contiene metadatos del mensaje (remitente, destinatario, fecha)
- **Body:** Contiene el contenido y datos adicionales
- **Beneficio:** Agrupa lógicamente información relacionada, facilitando búsquedas y actualizaciones

### 3. **Campo `id` Único**
- **Razón:** Identificador único y legible del mensaje (además del `_id` de MongoDB)
- **Formato:** UUID para garantizar unicidad global
- **Uso:** Permite búsquedas rápidas y referencias externas

### 4. **Campo `stamp` Automático**
- **Razón:** Evita manipulación de timestamps en el cliente
- **Asignación:** Se asigna en el servidor al crear el mensaje
- **Tipo:** ISO 8601 Date para compatibilidad universal

### 5. **Campo `adjunto` Opcional**
- **Tipo:** String (URL)
- **Razón:** Se almacena como referencia, no como archivo binario
- **Ventaja:** Reduce tamaño de la BD, permite gestión externa de archivos

### 6. **Campo `token` Opcional**
- **Tipo:** String
- **Razón:** Reservado para autenticación en Parcial 3
- **Uso:** JWT u otro token de seguridad

## Índices

Se crean tres índices para optimizar las búsquedas:

```javascript
// Búsquedas por remitente (ordenadas por fecha descendente)
db.messages.createIndex({ "headers.de": 1, "headers.stamp": -1 });

// Búsquedas por destinatario (ordenadas por fecha descendente)
db.messages.createIndex({ "headers.para": 1, "headers.stamp": -1 });

// Búsquedas por ID único del mensaje
db.messages.createIndex({ "headers.id": 1 }, { unique: true });
```

## Operaciones Principales

### 1. Obtener cabeceras de un usuario (enviados y recibidos)
```javascript
// Búsqueda con múltiples condiciones OR
db.messages.find({
  $or: [
    { "headers.de": "usuario1@example.com" },
    { "headers.para": "usuario1@example.com" }
  ]
}).sort({ "headers.stamp": -1 });
```

### 2. Obtener mensaje completo por ID
```javascript
db.messages.findOne({ "headers.id": "msg_12345" });
```

### 3. Crear nuevo mensaje
```javascript
db.messages.insertOne({
  headers: {
    id: "msg_uuid",
    de: "usuario1@example.com",
    para: "usuario2@example.com",
    asunto: "Asunto",
    stamp: new Date()
  },
  body: {
    contenido: "Contenido del mensaje",
    adjunto: null,
    token: null
  }
});
```

## Escalabilidad

- **Sharding:** MongoDB permite particionar la colección por `headers.para` para distribuir datos
- **Replicación:** Se puede configurar un ReplicaSet para alta disponibilidad
- **Archivado:** Los mensajes antiguos pueden movarse a una colección de archivo

## Seguridad

- El campo `token` se usa para validar identidad del remitente
- Se recomienda usar HTTPS en producción
- Implementar autenticación OAuth2 con Google
