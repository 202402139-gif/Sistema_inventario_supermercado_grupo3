# Super Ahorro — Instrucciones de instalación

## Requisitos previos

- Node.js 18 o superior
- npm
- MySQL 8 (o compatible) corriendo localmente
- Angular CLI (`npm install -g @angular/cli`) — opcional, `ng serve` también funciona sin instalación global

## 1. Base de datos

Crea la base de datos ejecutando el script principal en MySQL:

```bash
mysql -u root -p < Database/SUPERMERCADO.sql
```

Esto crea la base `proyectoClase` con las tablas `usuarios`, `proveedores`, `categorias`, `productos`, `ordenes_compra` y `ordenes_compra_detalle`.

## 2. Backend

```bash
cd Backend
npm install
cp .env.example .env
```

Edita `.env` con los datos de tu conexión MySQL, y luego levanta el servidor:

```bash
npm start
```

La API queda disponible en: `http://localhost:4000/api`

`npm install` instala automáticamente las siguientes dependencias (ya declaradas en `Backend/package.json`):

| Paquete | Versión | Uso |
|---|---|---|
| express | ^5.2.1 | Servidor y rutas de la API |
| mysql2 | ^3.23.3 | Conexión y consultas a MySQL |
| cors | ^2.8.6 | Habilitar peticiones cross-origin desde el frontend |
| morgan | ^1.12.0 | Logs de las peticiones HTTP en consola |
| dotenv | ^17.4.2 | Cargar variables del archivo .env |
| bcrypt | ^6.0.0 | Cifrado de contraseñas |
| jsonwebtoken | ^9.0.2 | Generación y verificación de JWT |

### Variables de entorno (`Backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| PORT | Puerto del servidor backend | 4000 |
| DB_HOST | Host de MySQL | localhost |
| DB_PORT | Puerto de MySQL | 3306 |
| DB_NAME | Nombre de la base de datos | proyectoClase |
| DB_USER | Usuario de MySQL | root |
| DB_PASSWORD | Contraseña de MySQL | (tu contraseña) |
| JWT_SECRET | Secreto para firmar los tokens JWT | (cadena aleatoria y privada) |
| JWT_EXPIRES_IN | Duración del token | 8h |

## 3. Frontend

```bash
cd Frontend/app-supermercado
npm install
npm install zone.js
ng serve
```

La aplicación queda disponible en: `http://localhost:4200`

Dependencias principales instaladas automáticamente:

| Paquete | Versión | Uso |
|---|---|---|
| @angular/core, common, compiler, forms, platform-browser, router | ^22.1.0 | Framework Angular |
| bootstrap | ^5.3.8 | Estilos y componentes UI |
| rxjs | ~7.8.0 | Manejo de observables (peticiones HTTP, formularios) |
| tslib | ^2.3.0 | Utilidades de TypeScript requeridas por Angular |
| zone.js | ^0.16.3 | Detección de cambios de Angular |

Dependencias de desarrollo: `@angular/cli`, `@angular/build`, `@angular/compiler-cli`, `typescript`, `prettier`, `jsdom`, `vitest`.

## Primer uso

El primer usuario debe registrarse desde `/registro`. Para poder crear, editar o eliminar productos y proveedores, el usuario debe registrarse con el rol **Administrador**.

## Módulos del sistema

| Módulo | Descripción |
|---|---|
| 1. Autenticación | Registro, login, JWT, roles (administrador/empleado) |
| 2. Productos | CRUD de productos, alerta de stock bajo |
| 3. Proveedores | CRUD de proveedores |
| 4. Órdenes de Compra | Crear órdenes, actualización automática de stock |
| 5. Dashboard | Totales del sistema, stock bajo, gráfico de órdenes por mes |
