# Guía de Inicio Rápido - TextME

## ✅ Prerequisitos

- **Node.js** v14+: https://nodejs.org/
- **MongoDB**: https://www.mongodb.com/try/download/community
- **Git** (opcional): https://git-scm.com/

## 🚀 Pasos para Ejecutar

### Paso 1: Descargar e Instalar MongoDB

1. Descargar desde: https://www.mongodb.com/try/download/community
2. Seguir el instalador
3. Verificar que está instalado:
   ```powershell
   mongod --version
   ```

### Paso 2: Iniciar el Servidor MongoDB

En PowerShell (como Administrador):

```powershell
# Opción A: Si MongoDB está instalado como servicio Windows
net start MongoDB

# Opción B: Ejecutar directamente
mongod
```

Deberías ver un mensaje como:
```
[initandlisten] Waiting for connections on port 27017
```

### Paso 3: Cargar Datos de Ejemplo (Opcional)

En otra ventana de PowerShell:

```powershell
cd "c:\Users\josem\OneDrive\Desktop\VSCode\ExamenWebPractica"
node seedDatabase.js
```

Deberías ver:
```
Conectado a MongoDB
Colección limpiada
5 mensajes insertados exitosamente
Total de mensajes en la BD: 5
Desconectado de MongoDB
```

### Paso 4: Iniciar el Servidor de la Aplicación

```powershell
cd "c:\Users\josem\OneDrive\Desktop\VSCode\ExamenWebPractica"
npm start
```

O con nodemon (reinicia automáticamente):
```powershell
npm run dev
```

Deberías ver:
```
MongoDB conectado: localhost
Servidor ejecutándose en puerto 5000
```

### Paso 5: Probar la Aplicación

#### Opción A: Con el script de pruebas

```powershell
node test-api.js
```

#### Opción B: Con curl en PowerShell

```powershell
# Obtener mensajes de un usuario
curl -X GET "http://localhost:5000/api/messages/user/juan@example.com"

# Crear un mensaje
curl -X POST "http://localhost:5000/api/message" `
  -H "Content-Type: application/json" `
  -d '{
    "de": "test@example.com",
    "para": "otro@example.com",
    "asunto": "Mensaje de prueba",
    "contenido": "Hola, esto es una prueba"
  }'

# Obtener un mensaje completo
curl -X GET "http://localhost:5000/api/message/msg_001"
```

#### Opción C: Con un navegador

1. Abre: http://localhost:5000/
2. Deberías ver un JSON con información de la API

#### Opción D: Con Postman o Thunder Client

1. Importar las colecciones desde `examples.js`
2. Probar cada endpoint

## 📋 Funcionalidades Implementadas

### 1. Obtener cabeceras de mensajes de un usuario
- **Endpoint**: `GET /api/messages/user/:email`
- **Ejemplo**: `/api/messages/user/juan@example.com`
- **Orden**: Descendente por fecha (más recientes primero)
- **Retorna**: Solo cabeceras (id, de, para, asunto, stamp)

### 2. Obtener mensaje completo
- **Endpoint**: `GET /api/message/:id`
- **Ejemplo**: `/api/message/msg_001`
- **Retorna**: Cabecera + Cuerpo completo

### 3. Crear nuevo mensaje
- **Endpoint**: `POST /api/message`
- **Campos requeridos**: `de`, `para`, `asunto`, `contenido`
- **Campos opcionales**: `adjunto`, `token`
- **Retorna**: ID del mensaje creado y metadatos

## 📁 Archivos Principales

- `server.js` - Servidor Express
- `models/Message.js` - Esquema de MongoDB
- `routes/messageRoutes.js` - Rutas de la API
- `seedDatabase.js` - Datos de ejemplo
- `test-api.js` - Pruebas automatizadas
- `DATABASE_DESIGN.md` - Documentación de BD
- `README.md` - Documentación completa

## 🐛 Solución de Problemas

### Problema: "MongoDB no inicia"
**Solución**: 
1. Verifica que MongoDB está instalado: `mongod --version`
2. Intenta ejecutar: `mongod --dbpath "C:\data\db"`
3. Crea la carpeta si no existe

### Problema: "Puerto 5000 ya en uso"
**Solución**:
1. Edita `.env` y cambia `PORT=5001`
2. O detén el proceso que usa el puerto:
   ```powershell
   Get-Process | Where-Object { $_.Name -eq "node" } | Stop-Process
   ```

### Problema: "Conexión a MongoDB rechazada"
**Solución**:
1. Asegúrate que MongoDB está corriendo: `net start MongoDB`
2. Verifica que está en puerto 27017
3. Revisa la URI en `.env`: `MONGODB_URI=mongodb://localhost:27017/textme`

## 📊 Verificar que Todo Funciona

1. Abre http://localhost:5000 en el navegador
2. Deberías ver un JSON de respuesta
3. Ejecuta: `node test-api.js`
4. Todos los tests deberían pasar ✅

## 🎯 Próximos Pasos

Para continuar con Parcial 3 (si es necesario):
- El campo `token` ya está preparado en el esquema
- Implementar autenticación Google OAuth2
- Validar tokens en los endpoints

¡Listo! Tu aplicación TextME está funcionando 🎉
