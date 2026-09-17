import { Router } from 'express';
import {
  verificarToken, verificarRol, registrar, login,
  listarProveedores, obtenerProveedor, crearProveedor, actualizarProveedor, eliminarProveedor,
  listarProductos, stockBajo, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto,
} from '../controllers/supermercado.controller.js';
import { crearOrden, listarOrdenes, obtenerOrden, cambiarEstadoOrden } from '../controllers/ordenCompra.controller.js';
import { resumen, stockBajoDashboard, ordenesPorMes } from '../controllers/dashboard.controller.js';

const router = Router();

router.post('/auth/register', registrar);
router.post('/auth/login', login);

router.get('/proveedores', verificarToken, listarProveedores);
router.get('/proveedores/:id', verificarToken, obtenerProveedor);
router.post('/proveedores', verificarToken, verificarRol('administrador'), crearProveedor);
router.put('/proveedores/:id', verificarToken, verificarRol('administrador'), actualizarProveedor);
router.delete('/proveedores/:id', verificarToken, verificarRol('administrador'), eliminarProveedor);

router.get('/productos/stock-bajo', verificarToken, stockBajo);
router.get('/productos', verificarToken, listarProductos);
router.get('/productos/:id', verificarToken, obtenerProducto);
router.post('/productos', verificarToken, verificarRol('administrador'), crearProducto);
router.put('/productos/:id', verificarToken, verificarRol('administrador'), actualizarProducto);
router.delete('/productos/:id', verificarToken, verificarRol('administrador'), eliminarProducto);

router.post('/ordenes', verificarToken, crearOrden);
router.get('/ordenes', verificarToken, listarOrdenes);
router.get('/ordenes/:id', verificarToken, obtenerOrden);
router.patch('/ordenes/:id/estado', verificarToken, cambiarEstadoOrden);

router.get('/dashboard/resumen', verificarToken, resumen);
router.get('/dashboard/stock-bajo', verificarToken, stockBajoDashboard);
router.get('/dashboard/ordenes-por-mes', verificarToken, ordenesPorMes);

export default router;
