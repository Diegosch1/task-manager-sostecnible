# Task Manager — Sostecnible

Aplicación fullstack de gestión de tareas desarrollada como prueba técnica. Cuenta con una API RESTful en Java y Spring Boot siguiendo principios de **Clean Architecture**, y una SPA en React con énfasis en usabilidad y experiencia de usuario.

---

## Estructura del repositorio

```
task-manager/
├── task-manager-backend/    # API RESTful — Java 21 + Spring Boot 4
├── task-manager-frontend/   # SPA — React 19 + Vite
└── README.md
```

---

## Tecnologías

### Backend
- Java 21
- Spring Boot 4.0.3
- Spring Data JPA + Hibernate
- MySQL 8
- Lombok
- Maven

### Frontend
- React 19
- Vite
- Zustand — estado global de la UI
- TanStack Query (React Query) — fetching, caché y sincronización
- Axios — cliente HTTP
- date-fns — formateo de fechas
- lucide-react — íconos

---

## Requisitos previos

- Java 21 o superior
- Node.js 18 o superior
- MySQL 8 corriendo localmente (se puede usar XAMPP)
- Maven (incluido en el proyecto vía `mvnw`)

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Diegosch1/task-manager-sostecnible
cd task-manager-sostecnible
```

---

### 2. Configurar y ejecutar el backend

#### 2.1 Crear la base de datos

Abre MySQL Workbench u otro cliente MySQL y ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS taskmanager_db;
```

#### 2.2 Configurar credenciales

Abre `task-manager-backend/src/main/resources/application.yml` y ajusta las credenciales:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/taskmanager_db
    username: root
    password: YOUR_PASSWORD_HERE
```

> Si tu usuario root no tiene contraseña, deja el campo `password` como `""`.

#### 2.3 Ejecutar el backend

```bash
cd task-manager-backend
./mvnw spring-boot:run
```

En Windows sin bash:

```bash
mvnw.cmd spring-boot:run
```

El servidor arrancará en `http://localhost:8080`. Spring Boot creará automáticamente la tabla `tasks` al iniciar por primera vez.

---

### 3. Configurar y ejecutar el frontend

```bash
cd task-manager-frontend
npm install
npm run dev
```

La aplicación abrirá en `http://localhost:5173`.

---

## Ejecución de pruebas del backend

Las pruebas unitarias cubren la lógica de negocio del backend:

```bash
cd task-manager-backend
./mvnw test
```

En Windows sin bash:

```bash
mvnw.cmd test
```

Resultado esperado:

```
Tests run: 24, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

### Cobertura de pruebas

| Capa | Archivo | Pruebas |
|------|---------|---------|
| Application | `TaskServiceTest` | 14 pruebas — lógica de negocio, validaciones, operaciones CRUD |
| Infrastructure | `TaskControllerTest` | 10 pruebas — códigos HTTP, delegación al caso de uso |

---
### Pruebas del frontend
```bash
cd task-manager-frontend
npm run test
```

Resultado esperado:
```
Test Files  3 passed (3)
     Tests  24 passed (24)
```

### Cobertura de pruebas frontend

| Archivo | Pruebas |
|---------|---------|
| `useTaskStore.test.js` | 12 pruebas — filtros, creación, edición, sidebar |
| `Badge.test.jsx` | 6 pruebas — renderizado de prioridades y estados |
| `TaskList.test.jsx` | 6 pruebas — estados de carga, error, vacío y con datos |
---
## Arquitectura del backend

El backend sigue **Clean Architecture**, con dependencias que siempre apuntan hacia adentro:

```
src/main/java/com/sostecnible/taskmanager/
│
├── domain/                              # Capa más interna — Java puro
│   └── model/
│       ├── Task.java                    # Entidad de dominio
│       ├── Priority.java               # Enum: HIGH, MEDIUM, LOW
│       └── TaskStatus.java             # Enum: PENDING, COMPLETED
│
├── application/                         # Casos de uso
│   ├── port/
│   │   ├── in/TaskUseCase.java         # Puerto de entrada
│   │   └── out/TaskRepositoryPort.java # Puerto de salida
│   └── service/
│       └── TaskService.java            # Implementa la lógica de negocio
│
└── infrastructure/                      # Capa más externa — Spring, JPA, HTTP
    ├── persistence/
    │   ├── entity/TaskEntity.java       # Entidad JPA (separada del dominio)
    │   ├── mapper/TaskMapper.java       # Convierte entre Domain ↔ Entity
    │   ├── repository/
    │   │   ├── JpaTaskRepository.java
    │   │   └── TaskRepositoryAdapter.java
    │   └── specification/
    │       └── TaskSpecification.java   # Filtros dinámicos con JPA Criteria
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
  "createdAt": "2026-03-18T03:10:00",
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
| `priority` | Filtra por prioridad | `?priority=HIGH` |
| `title` | Búsqueda parcial por título | `?title=login` |
| `sortBy` | Ordena los resultados | `?sortBy=priority` o `?sortBy=createdAt` |

---

### Obtener una tarea por ID

```
GET /api/tasks/{id}
```

---

### Actualizar una tarea

```
PUT /api/tasks/{id}
```

**Body:** mismos campos que POST.

---

### Eliminar una tarea

```
DELETE /api/tasks/{id}
```

**Respuesta exitosa — 204 No Content**

---

### Valores válidos

| Campo | Valores aceptados |
|-------|------------------|
| `priority` | `HIGH`, `MEDIUM`, `LOW` |
| `status` | `PENDING`, `COMPLETED` |
| `sortBy` | `priority`, `createdAt` (por defecto) |

---

### Validaciones

- `title` — obligatorio, no puede estar vacío
- `description` — obligatorio, no puede estar vacío
- `priority` — obligatorio

Si alguno falla, la API retorna `400 Bad Request` con el detalle del error.

---

## Estructura del frontend

```
src/
├── api/
│   └── taskApi.js               # Centraliza todas las llamadas HTTP
├── components/
│   ├── common/
│   │   ├── Badge/               # Badge de prioridad y estado
│   │   ├── Button/              # Botón reutilizable con variantes
│   │   └── SelectField/         # Select personalizado con íconos
│   ├── layout/
│   │   ├── Header/              # Buscador + botón nueva tarea
│   │   └── Sidebar/             # Filtros y ordenamiento
│   └── tasks/
│       ├── TaskCard/            # Tarjeta de tarea en la lista
│       ├── TaskList/            # Lista principal
│       └── TaskRow/             # Formulario inline de creación y edición
├── hooks/
│   └── useTasks.js              # Hooks de React Query
├── pages/
│   └── TasksPage.jsx
└── store/
    └── useTaskStore.js          # Store de Zustand
```

`Espero les guste :)`

Diego Rodríguez, 2026 for Sostecnible