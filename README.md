# Trabajo Práctico — Sprint 1
## CRUD Fullstack con Node.js, Express, Prisma y MySQL

---

# Objetivo

Desarrollar un sistema de gestión simple tipo CRUD utilizando:

- Node.js
- Express
- Prisma ORM
- MySQL
- HTML
- CSS
- JavaScript Vanilla

El objetivo de este sprint es construir una primera versión funcional del sistema con frontend y backend conectados entre sí.

---

# Temática del sistema

La temática es libre.

Ejemplos:

- Gestión de alumnos
- Gestión de productos
- Gestión de películas
- Gestión de mascotas
- Gestión de tareas
- Gestión de libros
- Gestión de turnos

El sistema debe representar una entidad real y tener sentido como aplicación de gestión.

---

# Requisitos del Backend

## Tecnologías obligatorias

- Node.js
- Express
- Prisma
- MySQL

---

## API REST

El backend debe exponer endpoints funcionales para realizar operaciones CRUD.

Como mínimo debe incluir:

```http
GET /recurso
GET /recurso/:id
POST /recurso
PUT /recurso/:id
DELETE /recurso/:id
```

Ejemplo:

```http
GET /productos
POST /productos
PUT /productos/:id
DELETE /productos/:id
```

---

## Base de Datos

Debe incluir:

- Modelo Prisma correctamente definido
- Migraciones funcionales
- Conexión a MySQL

---

## Validaciones básicas

El sistema debe validar al menos:

- Campos obligatorios
- Strings vacíos
- Valores inválidos
- IDs inexistentes

No es obligatorio utilizar librerías externas de validación.

---

# Requisitos del Frontend

## Tecnologías obligatorias

- HTML
- CSS
- JavaScript Vanilla

No se permite utilizar frameworks frontend.

Ejemplos NO permitidos:

- React
- Vue
- Angular
- Next.js

---

## Funcionalidades mínimas

### 1. Listado de datos

Mostrar registros obtenidos desde el backend utilizando `fetch`.

---

### 2. Alta de registros

Crear nuevos registros desde la interfaz web.

---

### 3. Eliminación de registros

Permitir borrar registros desde la interfaz.

---

### 4. Edición de registros

Permitir editar al menos un campo de un registro existente.

---

# Estructura mínima sugerida

```txt
/backend
/frontend
```

Ejemplo backend:

```txt
backend/
└── src/
    ├── routes/
    ├── prisma/
    └── index.js
```

---

# Entregable

## Deben entregar:

### 1. Código fuente

Repositorio GitHub o archivo comprimido `.zip`.

---

### 2. README.md

Debe incluir:

- Nombre del proyecto
- Tecnologías utilizadas
- Instrucciones de instalación
- Instrucciones de ejecución
- Descripción breve del sistema

---

### 3. Base de datos

Debe incluir:

- `schema.prisma`
- migraciones

---

### 4. Video demostrativo (Opcional)

Video corto de 2 a 5 minutos mostrando:

- Funcionamiento del CRUD
- Base de datos
- Estructura del proyecto

---

# Criterios de evaluación

| Criterio | Puntaje |
|---|---|
| Backend funcional | 30 |
| Prisma + MySQL | 20 |
| Frontend conectado | 25 |
| CRUD completo | 15 |
| Organización y claridad del proyecto | 10 |

---

# Restricciones

## No está permitido:

- Utilizar frameworks frontend
- Copiar proyectos completos de internet
- Entregar código que no puedan explicar

---

# Fecha de entrega

21 de Mayo
