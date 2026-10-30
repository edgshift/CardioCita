Trabajo de Jira Aplicando SCRUM

## CardioCita

Sistema web para registrar pacientes que ingresan por citas o motivos médicos diferentes a la entidad médica.

## Roles

- Ivana: QA
- Mirelys: Desarrollador Frontend
- Sebastián: Product Owner y Desarrollador Backend
- Edgar: Scrum Master y Desarrollador Backend

### Stack

**Backend:** NodeJS + Express + MongoDB (Mongoose), autenticación con JWT
**Frontend:** HTML, CSS, JavaScript

## Entidades

### Paciente

- Nombre(s)
- Apellido(s)
- Edad
- Cédula (11 dígitos)
- Fecha de Nacimiento
- Sexo (Femenino / Masculino)
- Enfermedad

## Backend

### Estructura

```
src/
├── config/database.js          Conexión a MongoDB
├── controllers/                Lógica de cada entidad
├── middlewares/                Validaciones, autenticación y manejo de errores
├── models/                     Esquemas de Mongoose
├── routes/                     Definición de endpoints
├── scripts/seedDoctor.js       Crea el usuario del doctor
└── server.js                   Punto de entrada de la API
tests/api.test.js               Pruebas de la API
```

### Requisitos

- Node.js 18 o superior
- MongoDB local (`mongodb://127.0.0.1:27017`) o una cadena de conexión de MongoDB Atlas

### Instalación

```bash
npm install
cp .env.example .env   # y ajusta MONGO_URI y JWT_SECRET
npm run seed           # crea el usuario doctor (DOCTOR_USER / DOCTOR_PASSWORD)
npm run dev            # servidor con recarga automática en http://localhost:3000
```

### Scripts

| Script | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor |
| `npm run dev` | Inicia el servidor con nodemon |
| `npm run seed` | Crea el usuario doctor a partir del `.env` |
| `npm test` | Ejecuta las pruebas de la API |

### Autenticación (H1)

Todas las rutas de pacientes requieren el token que devuelve el login:

```http
Authorization: Bearer <token>
```

### Endpoints

| Método | Ruta | Descripción | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Inicia sesión | No |
| GET | `/api/auth/profile` | Devuelve el usuario del token | Sí |
| GET | `/api/patients` | Lista los pacientes (más recientes primero) | Sí |
| POST | `/api/patients` | Registra un paciente (HU1) | Sí |
| GET | `/api/patients/:id` | Consulta un paciente | Sí |
| PUT | `/api/patients/:id` | Actualiza un paciente (HU2) | Sí |
| DELETE | `/api/patients/:id` | Elimina un paciente (HU3) | Sí |

#### POST `/api/auth/login`

```json
{ "usuario": "doctor", "password": "CardioCita123" }
```

Respuesta `200`:

```json
{
  "mensaje": "Sesión iniciada correctamente",
  "token": "eyJhbGciOi...",
  "usuario": { "id": "...", "usuario": "doctor" }
}
```

Credenciales incorrectas: `401` con `{ "mensaje": "Usuario o contraseña incorrectos" }`.

#### POST `/api/patients`

```json
{
  "nombres": "Ana María",
  "apellidos": "Pérez Gómez",
  "edad": 45,
  "cedula": "12345678901",
  "fechaNacimiento": "1980-05-12",
  "sexo": "Femenino",
  "tipoEnfermedad": "Hipertension arterial"
}
```

Respuesta `201`:

```json
{
  "mensaje": "Paciente registrado correctamente",
  "paciente": { "_id": "...", "nombres": "Ana María", "...": "..." }
}
```

#### Errores comunes

| Código | Caso |
| --- | --- |
| 400 | Datos inválidos (edad negativa o decimal, cédula mal formada, campos faltantes) |
| 401 | Sin token, token vencido o credenciales incorrectas |
| 404 | Paciente o ruta inexistente |
| 409 | Cédula ya registrada |
| 500 | Error interno |

Las respuestas `400` incluyen el detalle en `errores`, por ejemplo:

```json
{
  "mensaje": "Los datos enviados no son válidos",
  "errores": ["La edad debe ser un número entero no negativo"]
}
```

### Tickets cubiertos por el backend

- **HU1 / CAR-1:** registrar paciente con validación de campos obligatorios y edades enteras no negativas.
- **HU2:** modificar el registro de un paciente.
- **HU3 / CAR-3:** eliminar el registro de un paciente.
- **HU4 / CAR-5:** listar los pacientes registrados.
- **H1:** login con credenciales válidas y protección de las rutas.

El frontend (formulario, tabla, botones y confirmación de borrado) queda pendiente del lado de Frontend.
