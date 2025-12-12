# Memoria Técnica – ReViews (Reseñas con Mapas)

## Información de Despliegue
- **URL pública (cloud)**: [Rellenar URL de Vercel aquí]
- **Repositorio GitHub**: https://github.com/JMFrz/webExamen

## Tecnologías Utilizadas
- **Proveedor cloud**: Vercel (serverless Node)
- **Backend**: Node.js + Express (v22 compatible)
- **Base de datos**: MongoDB (Atlas o local) via Mongoose
- **Autenticación**: JWT; Google Identity Services (OAuth); opcional GitHub OAuth
- **Frontend**: HTML/CSS/JS, Leaflet para mapas, Google One Tap/Sign-In
- **Servicios externos**: Nominatim (OpenStreetMap) para geocoding; Cloudinary para imágenes

## Estructura de Proyecto y Endpoints
- **Entradas**: `server.js` (local), `api/index.js` (Vercel serverless)
- **Rutas principales**:
  - `POST /api/auth/google` – login con Google (requiere `GOOGLE_CLIENT_ID`)
  - `POST /api/auth/github` – login con GitHub (opcional)
  - `GET /api/auth/me` – datos usuario autenticado
  - `GET /api/reviews` – listado de reseñas
  - `GET /api/review/:id` – detalle de reseña
  - `POST /api/review` – crear reseña (multipart con imágenes)

## Instrucciones de Instalación y Ejecución (Local)
1. **Requisitos**
   - Node.js 18+ (probado con 22)
   - Una instancia de MongoDB (Atlas o local)
   - Cuenta y credenciales de Cloudinary (opcional para subir imágenes)
   - Un Client ID de Google OAuth (Google Identity Services)

2. **Configurar variables de entorno (`.env`)**
   - `MONGODB_URI` – cadena de conexión a MongoDB (Atlas o local)
   - `JWT_SECRET` – secreto para firmar/verificar JWT
   - `GOOGLE_CLIENT_ID` – debe coincidir con el `data-client_id` usado en `public/index.html`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` – opcional para imágenes
   - (Opcional) `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` – si se usa login con GitHub

3. **Instalación**
   ```powershell
   cd C:\Users\josem\OneDrive\Desktop\VSCode\ExamenWebPractica
   npm install
   ```

4. **Ejecución en local**
   ```powershell
   npm start
   ```
   - Abre `http://localhost:5000`.
   - Inicia sesión con Google. Tras el login, se mostrará el mapa y las reseñas.

5. **Notas de configuración local**
   - El backend valida el `idToken` de Google contra `GOOGLE_CLIENT_ID`. Asegúrate de que el valor en `.env` es el mismo que el `data-client_id` del botón Google en `public/index.html`.
   - Si no configuras Cloudinary, la creación de reseñas funcionará sin imágenes.

## Despliegue en la Nube (Vercel)
1. **Conectar el repo**: Importa el repositorio `JMFrz/webExamen` en Vercel.
2. **Variables de entorno (Project Settings → Environment Variables)**:
   - `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`
   - Opcionales para GitHub y Cloudinary: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `CLOUDINARY_*`
3. **Configuración**:
   - El archivo `vercel.json` dirige todas las rutas a `api/index.js` (Express serverless).
   - Build preset: `@vercel/node`.
4. **Deploy**: tras configurar, Vercel generará la **URL pública**. Añádela en esta memoria.

## Base de Datos: URI / Verificación
- **Nombre DB**: ReViews (colecciones principales: `Review`, `User`).
- **URI ejemplo (Atlas)**: `mongodb+srv://<usuario>:<password>@<cluster>/<db>?retryWrites=true&w=majority`
- **Verificación rápida (Mongo Shell)**:
  ```javascript
  use ReViews;
  db.Review.find().limit(3);
  db.User.find().limit(3);
  ```
- Para auditoría, puede proporcionarse un usuario de solo lectura en Atlas; en esta entrega no se incluyen credenciales públicas.

## Funcionalidad Implementada
- Autenticación con Google; JWT almacenado en `localStorage` y usado en llamadas API.
- Mapa interactivo con Leaflet; marcadores por reseña; ajuste automático de bounds.
- Listado y detalle de reseñas: nombre, dirección, valoración, autor, token y fechas.
- Creación de reseñas: geocoding con Nominatim (reintentos, `User-Agent`, timeouts); subida opcional de imágenes a Cloudinary.
- Protección de rutas en backend con middleware `requireAuth`.

## Limitaciones y Problemas Conocidos
- **Rate limit Nominatim**: máx. ~1 req/seg. Se aplican reintentos y espera; direcciones ambiguas pueden fallar.
- **Dependencia de `GOOGLE_CLIENT_ID`**: debe coincidir entre frontend y backend.
- **Imágenes**: requieren credenciales Cloudinary; sin ellas, no se suben.
- **Auth requerida**: sin JWT válido, `GET /api/reviews` y `POST /api/review` devuelven 401.
- **Migración de proyecto**: se han eliminado referencias antiguas de “TextME” y rutas de mensajería; asegurado que `reviewRoutes` está registrado en local y cloud.

## Observaciones de Desarrollo
- Se refactorizó el `index.html` y mensajes de servidor a "ReViews".
- Se corrigió que la app no sea visible sin login (pantalla de login por defecto; `showApp()` tras autenticación).
- Se robusteció el geocoding (reintentos, `User-Agent`, `timeout`).

## Cómo Probar Rápido
1. Arranca backend local con `.env` completo.
2. Abre `http://localhost:5000` y haz login con Google.
3. Usa el buscador para centrar el mapa; crea una reseña con nombre/dirección/valoración.
4. Verifica que aparece en la lista y marcador en el mapa.

---
Rellena la **URL pública** de Vercel y, si procede, un usuario de lectura de Atlas para la verificación externa del tribunal.
