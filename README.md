# 🖥️ Sistema de Inventario de Equipos Informáticos - FORMOTEX

API RESTful desarrollada en TypeScript, Express y MongoDB para la gestión integral del inventario de equipos informáticos de FORMOTEX, con autenticación JWT y control de acceso basado en roles.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Arquitectura](#-arquitectura)
- [Modelos de Datos](#-modelos-de-datos)
- [Seguridad](#-seguridad)

## ✨ Características

- ✅ Autenticación JWT con roles (Admin/Usuario)
- ✅ CRUD completo de equipos informáticos
- ✅ Control de acceso granular por rol
- ✅ Seguimiento de responsables y ubicaciones
- ✅ Gestión de estados de equipos
- ✅ Validaciones robustas de datos
- ✅ Arquitectura modular y escalable
- ✅ TypeScript con tipado estricto

## 🛠️ Tecnologías

- **Runtime:** Node.js v18+
- **Lenguaje:** TypeScript
- **Framework:** Express.js
- **Base de datos:** MongoDB
- **ODM:** Mongoose
- **Autenticación:** JSON Web Tokens (JWT)
- **Encriptación:** bcryptjs

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 18 o superior)
- npm o yarn
- MongoDB (local o servicio en la nube como MongoDB Atlas)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Desarrollo-con-TypeScript
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar MongoDB

Asegúrate de que MongoDB esté ejecutándose:

**MongoDB local:**

```bash
mongod
```

**MongoDB Atlas:** Obtén tu cadena de conexión desde el panel de Atlas.

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
MONGO_URI=mongodb://localhost:27017/formotex_inventario
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
PORT=3000
```

**Importante:** Cambia `JWT_SECRET` por una cadena aleatoria y segura en producción.

### Inicializar Usuario Administrador

Como el registro requiere autenticación de administrador, necesitas crear el primer usuario admin manualmente:

**Opción 1: Script de inicialización (recomendado)**

```bash
npm run seed:admin
```

**Opción 2: Directamente en MongoDB**

```javascript
db.usuarios.insertOne({
  nombre: "Admin Principal",
  email: "admin@formotex.com",
  password: "$2a$10$...", // Hash de bcrypt de la contraseña
  rol: "admin",
});
```

## 🎯 Uso

### Iniciar el servidor en desarrollo

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### Iniciar en producción

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Autenticación

| Método | Endpoint             | Acceso  | Descripción                        |
| ------ | -------------------- | ------- | ---------------------------------- |
| POST   | `/api/auth/login`    | Público | Iniciar sesión y obtener token JWT |
| POST   | `/api/auth/register` | Admin   | Registrar nuevos usuarios          |

#### Ejemplo: Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@formotex.com",
  "password": "tu_password"
}
```

**Respuesta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "...",
    "nombre": "Admin Principal",
    "email": "admin@formotex.com",
    "rol": "admin"
  }
}
```

### Gestión de Equipos

| Método | Endpoint           | Acceso      | Descripción                                  |
| ------ | ------------------ | ----------- | -------------------------------------------- |
| GET    | `/api/equipos`     | Autenticado | Listar equipos (admin: todos, user: propios) |
| POST   | `/api/equipos`     | Autenticado | Crear nuevo equipo                           |
| PUT    | `/api/equipos/:id` | Autenticado | Actualizar equipo                            |
| DELETE | `/api/equipos/:id` | Admin       | Eliminar equipo                              |

#### Ejemplo: Crear Equipo

```bash
POST /api/equipos
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "nombre": "Laptop Desarrollo Backend",
  "modelo": "Dell Latitude 5420",
  "estado": "activo",
  "ubicacion": "Oficina Principal - Piso 2",
  "fechaAdquisicion": "2024-01-15"
}
```

#### Ejemplo: Listar Equipos

```bash
GET /api/equipos
Authorization: Bearer <tu_token_jwt>
```

## 🏗️ Arquitectura

El proyecto sigue una arquitectura por capas modular:

```
src/
├── config/          # Configuración y variables de entorno
├── models/          # Esquemas de Mongoose y tipos TypeScript
├── services/        # Lógica de negocio
├── controllers/     # Controladores HTTP
├── middleware/      # Middlewares (auth, roles, validación)
├── routes/          # Definición de rutas
└── server.ts        # Punto de entrada de la aplicación
```

### Principios de diseño

- **Separación de responsabilidades:** Cada capa tiene un propósito único
- **Reutilización:** Middlewares compartidos para autenticación y autorización
- **Escalabilidad:** Estructura modular que facilita el crecimiento
- **Mantenibilidad:** Código organizado y fácil de testear

## 💾 Modelos de Datos

### Usuario

```typescript
{
  nombre: string,
  email: string,        // Único, validado
  password: string,     // Hash con bcrypt
  rol: "admin" | "user"
}
```

### Equipo

```typescript
{
  nombre: string,                    // Nombre descriptivo
  modelo: string,                    // Marca y modelo
  estado: "activo" | "inactivo" | "en_reparacion",
  ubicacion: string,                 // Ubicación física
  fechaAdquisicion: Date,            // Fecha de compra
  responsable: ObjectId              // Referencia a Usuario
}
```

### Relaciones

- **Usuario → Equipos:** Un usuario puede ser responsable de múltiples equipos (1:N)
- Los usuarios con rol `user` solo pueden ver y gestionar sus equipos asignados
- Los usuarios con rol `admin` tienen acceso total a todos los equipos

## 🔐 Seguridad

### Autenticación

- **JWT (JSON Web Tokens):** Tokens firmados con HMAC-SHA256
- **Duración del token:** Configurable (por defecto 24h)
- **Almacenamiento:** El cliente debe guardar el token de forma segura

### Autorización

- **Middleware de autenticación:** Valida tokens en cada petición protegida
- **Middleware de roles:** Restringe acceso según privilegios

### Control de Acceso

| Rol       | Permisos                                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| **Admin** | • Ver todos los equipos<br>• Crear/editar/eliminar cualquier equipo<br>• Registrar nuevos usuarios              |
| **User**  | • Ver solo sus equipos asignados<br>• Crear equipos (se asigna automáticamente)<br>• Editar sus propios equipos |

### Protección de Contraseñas

- Hash con bcrypt (10 rondas de salt)
- Las contraseñas nunca se almacenan en texto plano
- No se devuelven contraseñas en las respuestas de la API

### Validaciones

- ✅ Email único por usuario
- ✅ Campos requeridos validados
- ✅ Formato de email verificado
- ✅ Estados de equipo restringidos a valores permitidos
