# 🎬 Sistema de Gestión de Películas y Favoritos (CRUD Fullstack)

## 📝 Descripción del Sistema

Este es un sistema de gestión cinematográfica construido como una aplicación web fullstack SPA (Single Page Application). Permite la administración de películas estructuradas por géneros e incorpora un sistema completo de autenticación y autorización basado en roles (RBAC).

Los usuarios con rol `ADMIN` pueden realizar operaciones CRUD completas sobre el catálogo, mientras que los usuarios con rol `USER` pueden explorar los títulos y gestionar su propia lista personalizada de favoritos (*Watchlist*).

### Tecnologías utilizadas

- **Backend:** Node.js, Express, Prisma ORM, MySQL.
- **Seguridad:** Hasheo con bcrypt, autenticación mediante JWT y control de acceso RBAC.
- **Validaciones y Errores:** express-validator y middleware centralizado de excepciones.
- **Frontend:** HTML5, CSS3 y JavaScript Vanilla (sin frameworks externos).

---

## 🚀 Instrucciones de Instalación y Ejecución

### 1. Configuración del Servidor (Backend)

1. Navega a la carpeta del servidor:

   ```bash
   cd backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz de la carpeta `backend` y define tus variables de conexión a la base de datos y la clave secreta de seguridad:

   ```env
   DATABASE_URL="mysql://tu_usuario:tu_contraseña@localhost:3306/peliculas_db"
   JWT_SECRET="clave_secreta_para_tokens_jwt"
   ```

4. Genera el historial de migraciones oficiales y sincroniza tu base de datos local de MySQL:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Inicia el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

   El backend quedará escuchando en:

   ```
   http://localhost:3000
   ```

---

### 2. Ejecución de la Interfaz (Frontend)

1. Dirígete a la carpeta `frontend/`.

2. Abre el archivo `index.html` en tu navegador web de preferencia:

   - Haciendo doble clic sobre el archivo.
   - Utilizando la extensión **Live Server** de VS Code.