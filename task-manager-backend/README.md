# Task Manager — Backend

API RESTful desarrollada con **Java 21** y **Spring Boot 4**, siguiendo los principios de **Clean Architecture** para garantizar el desacoplamiento de la lógica de negocio respecto a los frameworks y la capa de persistencia.

---

## Tecnologías

- Java 21
- Spring Boot 4.0.3
- Spring Data JPA + Hibernate
- MySQL 8
- Lombok
- Maven

---

## Requisitos previos

- Java 21 o superior instalado
- MySQL 8 corriendo localmente (se puede usar XAMPP)
- Maven (incluido en el proyecto vía `mvnw`)

---

## Configuración e instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd task-manager-backend
```

### 2. Crear la base de datos

Abre MySQL Workbench (u otro cliente MySQL) y ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS taskmanager_db;
```

### 3. Configurar credenciales

Abre el archivo `src/main/resources/application.yml` y ajusta las credenciales de tu MySQL:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/taskmanager_db
    username: root
    password: YOUR_PASSWORD_HERE
```

> Si tu usuario root no tiene contraseña (configuración por defecto de XAMPP), deja el campo `password` como `""`.

### 4. Ejecutar el proyecto

```bash
./mvnw spring-boot:run
```

En Windows sin bash:

```bash
mvnw.cmd spring-boot:run
```

El servidor arrancará en `http://localhost:8080`.

Spring Boot creará automáticamente la tabla `tasks` en la base de datos al iniciar por primera vez.

---

## Estructura del proyecto

El proyecto sigue **Clean Architecture**, con dependencias que siempre apuntan hacia adentro:

```
src/main/java/com/sostecnible/taskmanager/
│
├── domain/                         # Capa más interna — Java puro, sin dependencias externas
│   └── model/
│       ├── Task.java               # Entidad de dominio
│       ├── Priority.java           # Enum: HIGH, MEDIUM, LOW
│       └── TaskStatus.java         # Enum: PENDING, COMPLETED
│
├── application/                    # Casos de uso
│   ├── port/
│   │   ├── in/TaskUseCase.java     # Puerto de entrada (qué puede hacer el sistema)
│   │   └── out/TaskRepositoryPort.java  # Puerto de salida (qué necesita el sistema)
│   └── service/
│       └── TaskService.java        # Implementa la lógica de negocio
│
└── infrastructure/                 # Capa más externa — Spring, JPA, HTTP
    ├── persistence/
    │   ├── entity/TaskEntity.java  # Entidad JPA (separada del dominio)
    │   ├── mapper/TaskMapper.java  # Convierte entre Domain ↔ Entity
    │   ├── repository/
    │   │   ├── JpaTaskRepository.java       # Extiende JpaRepository
    │   │   └── TaskRepositoryAdapter.java   # Implementa TaskRepositoryPort
    │   └── specification/
    │       └── TaskSpecification.java       # Filtros dinámicos con JPA Criteria
    └── web/
        ├── controller/TaskController.java
        ├── dto/
        │   ├── TaskRequestDto.java
        │   └── TaskResponseDto.java
        ├── mapper/TaskDtoMapper.java
        └── exception/GlobalExceptionHandler.java
```

---

## Endpoints de la API

**URL base:** `http://localhost:8080/api/tasks`

### Crear una tarea

```
POST /api/tasks
```

**Body:**
```json
{
  "title": "Implementar login",
  "description": "Crear el sistema de autenticación con JWT",
  "priority": "HIGH",
  "dueDate": "2026-03-25T10:00:00",
  "status": "PENDING"
}
```

**Respuesta exitosa — 201 Created:**
```json
{
  "id": 1,
  "title": "Implementar login",
  "description": "Crear el sistema de autenticación con JWT",
  "priority": "HIGH",
  "createdAt": "2026-03-17T23:30:00",
  "dueDate": "2026-03-25T10:00:00",
  "status": "PENDING"
}
```

---

### Obtener todas las tareas

```
GET /api/tasks
```

Soporta los siguientes query params opcionales:

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `status` | Filtra por estado | `?status=PENDING` o `?status=COMPLETED` |
| `title` | Búsqueda parcial por título (insensible a mayúsculas) | `?title=login` |
| `sortBy` | Ordena los resultados | `?sortBy=priority` o `?sortBy=createdAt` |

**Ejemplos:**
```
GET /api/tasks
GET /api/tasks?status=PENDING
GET /api/tasks?title=login
GET /api/tasks?status=PENDING&sortBy=priority
GET /api/tasks?title=implementar&sortBy=createdAt
```

**Respuesta — 200 OK:**
```json
[
  {
    "id": 1,
    "title": "Implementar login",
    "description": "Crear el sistema de autenticación con JWT",
    "priority": "HIGH",
    "createdAt": "2026-03-17T23:30:00",
    "dueDate": "2026-03-25T10:00:00",
    "status": "PENDING"
  }
]
```

---

### Obtener una tarea por ID

```
GET /api/tasks/{id}
```

**Respuesta exitosa — 200 OK:**
```json
{
  "id": 1,
  "title": "Implementar login",
  "description": "Crear el sistema de autenticación con JWT",
  "priority": "HIGH",
  "createdAt": "2026-03-17T23:30:00",
  "dueDate": "2026-03-25T10:00:00",
  "status": "PENDING"
}
```

**Tarea no encontrada — 404 Not Found:**
```json
{
  "error": "Task not found with id: 99"
}
```

---

### Actualizar una tarea

```
PUT /api/tasks/{id}
```

**Body:**
```json
{
  "title": "Implementar login",
  "description": "Autenticación JWT con refresh tokens",
  "priority": "HIGH",
  "dueDate": "2026-03-28T10:00:00",
  "status": "COMPLETED"
}
```

**Respuesta exitosa — 200 OK:**
```json
{
  "id": 1,
  "title": "Implementar login",
  "description": "Autenticación JWT con refresh tokens",
  "priority": "HIGH",
  "createdAt": "2026-03-17T23:30:00",
  "dueDate": "2026-03-28T10:00:00",
  "status": "COMPLETED"
}
```

---

### Eliminar una tarea

```
DELETE /api/tasks/{id}
```

**Respuesta exitosa — 204 No Content**

**Tarea no encontrada — 404 Not Found:**
```json
{
  "error": "Task not found with id: 99"
}
```

---

## Valores válidos para los campos

| Campo | Valores aceptados |
|-------|------------------|
| `priority` | `HIGH`, `MEDIUM`, `LOW` |
| `status` | `PENDING`, `COMPLETED` |
| `sortBy` | `priority`, `createdAt` (por defecto) |

---

### Validaciones

- El campo `description` es **obligatorio** y no puede estar vacío. Si se envía vacío, la API retorna `400 Bad Request`:

```json
{
  "description": "Description is required"
}
```

- El campo `title` es **obligatorio**.
- El campo `priority` es **obligatorio**.
