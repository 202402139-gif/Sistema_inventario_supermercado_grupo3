Super Ahorro — Instrucciones de instalación
Requisitos previos
Node.js 18 o superior
npm
MySQL 8 (o compatible) corriendo localmente
Angular CLI (npm install -g @angular/cli) — opcional,  ng serve también funciona
1. Base de datos

Crea la base de datos ejecutando el script principal en MySQL:

bash
mysql -u root -p < Database/esquema_mysql_completo.sql

Esto crea la base proyectoClase con las tablas usuarios, proveedores, categorias, productos, ordenes_compra y ordenes_compra_detalle.

Si tu base ya existía antes de agregar el módulo de órdenes/dashboard, ejecuta también:

bash
mysql -u root -p < Database/persona3_ordenes_dashboard.sql
2. Backend
bash
cd Backend
npm install para agregar la caprtea node modules
cp .env.example .env
# Edita .env con los datos de tu conexión MySQL
depues de realizar el paso atenrio ejecuta el npm start en el backend

La API queda disponible en: http://localhost:4000/api


npm install instala automáticamente las siguientes dependencias (ya declaradas en Backend/package.json):

Paquete	Versión	Uso
express	^5.2.1	Servidor y rutas de la API
mysql2	^3.23.3	Conexión y consultas a MySQL
cors	^2.8.6	Habilitar peticiones cross-origin desde el frontend
morgan	^1.12.0	Logs de las peticiones HTTP en consola
dotenv	^17.4.2	Cargar variables del archivo .env
bcrypt	^6.0.0	Cifrado de contraseñas
jsonwebtoken	^9.0.2	Generación y verificación de JWT
zone.js en el frontend con npm install zone.js




Variables de entorno (Backend/.env)
Variable	Descripción	Ejemplo
PORT	Puerto del servidor backend	4000
DB_HOST	Host de MySQL	localhost
DB_PORT	Puerto de MySQL	3306
DB_NAME	Nombre de la base de datos	proyectoClase
DB_USER	Usuario de MySQL	root
DB_PASSWORD	Contraseña de MySQL	(tu contraseña)
JWT_SECRET	Secreto para firmar los tokens JWT	(cadena aleatoria y privada)
JWT_EXPIRES_IN	Duración del token	8h



3. Frontend
bash
cd Frontend/app-supermercado
npm install para instalar node modules
ng serve para iniciar y que te muestre la ruta

antes de correr la app debe de tener el cuenta que se deben de instalr ciertas cosas, con sus respectivas versiones
@angular/core, @angular/common, @angular/compiler, @angular/forms, @angular/platform-browser, @angular/router	^22.1.0	Framework Angular
bootstrap	^5.3.8	Estilos y componentes UI
rxjs	~7.8.0	Manejo de observables (peticiones HTTP, formularios)
tslib	^2.3.0	Utilidades de TypeScript requeridas por Angular

Dependencias de desarrollo (devDependencies): @angular/cli, @angular/build, @angular/compiler-cli, typescript, prettier, jsdom, vitest.
La aplicación queda disponible en: http://localhost:4200

El primer usuario debe registrarse desde /registro. Para poder crear, editar o eliminar productos y proveedores, el usuario debe registrarse con el rol Administrador.