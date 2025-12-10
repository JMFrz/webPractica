# Estructura del Proyecto TextME

```
ExamenWebPractica/
├── models/
│   └── Message.js                 # Modelo de datos para mensajes (MongoDB)
│
├── routes/
│   └── messageRoutes.js           # Rutas de la API REST
│
├── server.js                      # Servidor principal (Express)
├── .env                           # Variables de entorno (no subir a Git)
├── .gitignore                     # Archivos ignorados por Git
├── package.json                   # Dependencias del proyecto
├── package-lock.json              # Lock de versiones de npm
│
├── seedDatabase.js                # Script para cargar datos de ejemplo
├── test-api.js                    # Script de pruebas de la API
├── examples.js                    # Ejemplos de uso
│
├── README.md                      # Documentación principal
└── DATABASE_DESIGN.md             # Documentación del diseño de BD
```

## Descripción de Archivos

### `server.js`
- Punto de entrada de la aplicación
- Configura Express, CORS, middleware
- Conecta a MongoDB
- Define rutas principales

### `models/Message.js`
- Define el esquema de Mongoose para mensajes
- Configura validaciones
- Crea índices para optimizar búsquedas

### `routes/messageRoutes.js`
- Define los 3 endpoints principales:
  - GET `/api/messages/user/:email` - Obtener cabeceras
  - GET `/api/message/:id` - Obtener mensaje completo
  - POST `/api/message` - Crear nuevo mensaje

### `seedDatabase.js`
- Script para cargar datos de ejemplo en MongoDB
- Útil para pruebas iniciales

### `test-api.js`
- Suite de pruebas automatizadas
- Valida los 3 endpoints principales
- Prueba casos válidos e inválidos

## Flujo de Datos

```
Cliente HTTP
    ↓
  Express (server.js)
    ↓
  Rutas (messageRoutes.js)
    ↓
  Mongoose/Modelo (models/Message.js)
    ↓
  MongoDB
```

## Dependencias Principales

- **express**: Framework web minimalista
- **mongoose**: ODM (Object Data Modeling) para MongoDB
- **dotenv**: Carga variables de entorno desde .env
- **cors**: Habilitador de CORS para requests desde navegadores
- **uuid**: Generación de IDs únicos
- **nodemon**: Reinicia el servidor automáticamente en desarrollo
