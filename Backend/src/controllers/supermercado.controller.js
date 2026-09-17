import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import * as UsuarioModel from '../models/usuario.model.js';
import * as ProveedorModel from '../models/proveedor.model.js';
import * as ProductoModel from '../models/producto.model.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secreto123grupo3';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/* ==================== MIDDLEWARES ==================== */

export function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se ha proporciono un token.' });
  }
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ mensaje: 'Formato de token invalido. Use: Bearer <token>' });
  }
  try {
    req.usuario = jwt.verify(partes[1], JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token invalido o expirado.' });
  }
}

export function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ mensaje: 'Usuario no autenticado.' });
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tiene permisos para realizar esta accion.' });
    }
    next();
  };
}

/* ==================== AUTENTICACION ==================== */

export async function registrar(req, res) {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'nombre, email y password son obligatorios.' });
    }
    const existente = await UsuarioModel.buscarPorEmail(email);
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario registrado con ese email.' });
    }
    const contrasenaHash = await bcrypt.hash(password, SALT_ROUNDS);
    const rolValido = rol === 'administrador' ? 'administrador' : 'empleado';
    const nuevoUsuario = await UsuarioModel.crearUsuario({ nombre, email, contrasenaHash, rol: rolValido });
    return res.status(201).json({ mensaje: 'Usuario registrado correctamente.', usuario: nuevoUsuario });
  } catch (error) {
    console.error('Error en registrar:', error);
    return res.status(500).json({ mensaje: 'Error interno al registrar el usuario.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ mensaje: 'email y password son obligatorios.' });
    }
    const usuario = await UsuarioModel.buscarPorEmail(email);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Credenciales invalidas.' });
    }
    const passwordValido = await bcrypt.compare(password, usuario.contrasena);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales invalidas.' });
    }
    const payload = { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.status(200).json({ mensaje: 'Login exitoso.', token, usuario: payload });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Error interno al iniciar sesion.' });
  }
}

/* ==================== PROVEEDORES ==================== */

export async function listarProveedores(req, res) {
  try {
    const proveedores = await ProveedorModel.obtenerTodos();
    return res.status(200).json(proveedores);
  } catch (error) {
    console.error('Error en listarProveedores:', error);
    return res.status(500).json({ mensaje: 'Error interno al listar proveedores.' });
  }
}

export async function obtenerProveedor(req, res) {
  try {
    const proveedor = await ProveedorModel.obtenerPorId(req.params.id);
    if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado.' });
    return res.status(200).json(proveedor);
  } catch (error) {
    console.error('Error en obtenerProveedor:', error);
    return res.status(500).json({ mensaje: 'Error interno al obtener el proveedor.' });
  }
}

export async function crearProveedor(req, res) {
  try {
    const { nombre, contacto, telefono, email, direccion } = req.body;
    if (!nombre) return res.status(400).json({ mensaje: 'El campo nombre es obligatorio.' });
    const nuevo = await ProveedorModel.crear({ nombre, contacto, telefono, email, direccion });
    return res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error en crearProveedor:', error);
    return res.status(500).json({ mensaje: 'Error interno al crear el proveedor.' });
  }
}

export async function actualizarProveedor(req, res) {
  try {
    const { id } = req.params;
    const { nombre, contacto, telefono, email, direccion } = req.body;
    const existente = await ProveedorModel.obtenerPorId(id);
    if (!existente) return res.status(404).json({ mensaje: 'Proveedor no encontrado.' });
    const actualizado = await ProveedorModel.actualizar(id, { nombre, contacto, telefono, email, direccion });
    return res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error en actualizarProveedor:', error);
    return res.status(500).json({ mensaje: 'Error interno al actualizar el proveedor.' });
  }
}

export async function eliminarProveedor(req, res) {
  try {
    const eliminado = await ProveedorModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Proveedor no encontrado.' });
    return res.status(200).json({ mensaje: 'Proveedor eliminado correctamente.' });
  } catch (error) {
    console.error('Error en eliminarProveedor:', error);
    return res.status(500).json({ mensaje: 'Error interno al eliminar el proveedor.' });
  }
}

/* ==================== PRODUCTOS ==================== */

export async function listarProductos(req, res) {
  try {
    const productos = await ProductoModel.obtenerTodos();
    const conAlerta = productos.map((p) => ({ ...p, alerta_stock_bajo: p.stock_actual < p.stock_minimo }));
    return res.status(200).json(conAlerta);
  } catch (error) {
    console.error('Error en listarProductos:', error);
    return res.status(500).json({ mensaje: 'Error interno al listar productos.' });
  }
}

export async function stockBajo(req, res) {
  try {
    const productos = await ProductoModel.obtenerStockBajo();
    return res.status(200).json(productos);
  } catch (error) {
    console.error('Error en stockBajo:', error);
    return res.status(500).json({ mensaje: 'Error  al obtener productos, con stock bajo.' });
  }
}

export async function obtenerProducto(req, res) {
  try {
    const producto = await ProductoModel.obtenerPorId(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    return res.status(200).json({ ...producto, alerta_stock_bajo: producto.stock_actual < producto.stock_minimo });
  } catch (error) {
    console.error('Error en obtenerProducto:', error);
    return res.status(500).json({ mensaje: 'Error al obtener el producto.' });
  }
}

export async function crearProducto(req, res) {
  try {
    const { codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id } = req.body;
    if (!codigo || !nombre || precio === undefined) {
      return res.status(400).json({ mensaje: 'codigo, nombre y precio son obligatorios.' });
    }
    if (Number(precio) < 0) return res.status(400).json({ mensaje: 'El precio no puede estar en valores negativo.' });
    const existente = await ProductoModel.obtenerPorCodigo(codigo);
    if (existente) return res.status(409).json({ mensaje: 'Ya existe un producto con ese codigo, ingrese uno nuevo.' });
    const nuevo = await ProductoModel.crear({ codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id });
    return res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error en crearProducto:', error);
    return res.status(500).json({ mensaje: 'Error interno al crear el producto.' });
  }
}

export async function actualizarProducto(req, res) {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id } = req.body;
    const existente = await ProductoModel.obtenerPorId(id);
    if (!existente) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    if (precio !== undefined && Number(precio) < 0) {
      return res.status(400).json({ mensaje: 'El precio no puede estar en valores negativo.' });
    }
    const actualizado = await ProductoModel.actualizar(id, {
      codigo: codigo || existente.codigo,
      nombre: nombre || existente.nombre,
      descripcion: descripcion !== undefined ? descripcion : existente.descripcion,
      precio: precio !== undefined ? precio : existente.precio,
      stock_minimo: stock_minimo !== undefined ? stock_minimo : existente.stock_minimo,
      stock_actual: stock_actual !== undefined ? stock_actual : existente.stock_actual,
      categoria_id: categoria_id !== undefined ? categoria_id : existente.categoria_id,
    });
    return res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error en actualizarProducto:', error);
    return res.status(500).json({ mensaje: 'Error interno al actualizar el producto.' });
  }
}

export async function eliminarProducto(req, res) {
  try {
    const eliminado = await ProductoModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    return res.status(200).json({ mensaje: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error en eliminarProducto:', error);
    return res.status(500).json({ mensaje: 'Error interno al eliminar el producto.' });
  }
}