import * as OrdenModel from '../models/ordenCompra.model.js';

export async function crearOrden(req, res) {
  try {
    const { proveedor_id, productos } = req.body;
    if (!proveedor_id || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: 'proveedor_id y al menos un producto son obligatorios.' });
    }
    const orden = await OrdenModel.crearOrden({
      proveedor_id: Number(proveedor_id),
      usuario_id: req.usuario.id,
      productos
    });
    return res.status(201).json(orden);
  } catch (error) {
    console.error('Error en crearOrden:', error);
    if (error.message === 'PROVEEDOR_NO_EXISTE') return res.status(404).json({ mensaje: 'Proveedor no encontrado.' });
    if (error.message === 'ORDEN_SIN_PRODUCTOS') return res.status(400).json({ mensaje: 'La orden debe tener productos.' });
    if (error.message === 'CANTIDAD_INVALIDA') return res.status(400).json({ mensaje: 'Las cantidades deben ser enteros mayores que cero.' });
    if (error.message.startsWith('PRODUCTO_NO_EXISTE:')) return res.status(404).json({ mensaje: `Producto no disponible: ${error.message.split(':')[1]}.` });
    return res.status(500).json({ mensaje: 'Error interno al crear la orden.' });
  }
}

export async function listarOrdenes(req, res) {
  try {
    const { estado } = req.query;
    if (estado && !['pendiente', 'completada', 'cancelada'].includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado inválido.' });
    }
    return res.status(200).json(await OrdenModel.obtenerTodos(estado));
  } catch (error) {
    console.error('Error en listarOrdenes:', error);
    return res.status(500).json({ mensaje: 'Error interno al listar órdenes.' });
  }
}

export async function obtenerOrden(req, res) {
  try {
    const orden = await OrdenModel.obtenerPorId(req.params.id);
    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada.' });
    return res.status(200).json(orden);
  } catch (error) {
    console.error('Error en obtenerOrden:', error);
    return res.status(500).json({ mensaje: 'Error interno al obtener la orden.' });
  }
}

export async function cambiarEstadoOrden(req, res) {
  try {
    const { estado } = req.body;
    if (!estado) return res.status(400).json({ mensaje: 'El estado es obligatorio.' });
    const orden = await OrdenModel.cambiarEstado(req.params.id, estado);
    return res.status(200).json({ mensaje: 'Estado actualizado correctamente.', orden });
  } catch (error) {
    console.error('Error en cambiarEstadoOrden:', error);
    if (error.message === 'ESTADO_INVALIDO') return res.status(400).json({ mensaje: 'Estado inválido.' });
    if (error.message === 'ORDEN_NO_EXISTE') return res.status(404).json({ mensaje: 'Orden no encontrada.' });
    if (error.message === 'ORDEN_NO_MODIFICABLE') return res.status(409).json({ mensaje: 'Solo las órdenes pendientes pueden cambiar de estado.' });
    if (error.message.startsWith('PRODUCTO_NO_EXISTE:')) return res.status(409).json({ mensaje: 'Uno de los productos de la orden ya no está disponible.' });
    return res.status(500).json({ mensaje: 'Error interno al cambiar el estado.' });
  }
}
