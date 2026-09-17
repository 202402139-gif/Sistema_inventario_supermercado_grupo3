create database proyectoClase;

use proyectoClase;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'empleado') NOT NULL DEFAULT 'empleado',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    direccion VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE  productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock_minimo INT NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    categoria_id INT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);


CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_stock ON productos(stock_actual, stock_minimo);

CREATE TABLE  ordenes_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estado ENUM('pendiente', 'completada', 'cancelada') NOT NULL DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_recibido TIMESTAMP NULL,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE ordenes_compra_detalle (
    id  INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orden_id) REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);


