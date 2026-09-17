import { pool } from '../db.js';

export async function crearOrden({ proveedor_id, usuario_id, productos }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [proveedores] = await connection.query('SELECT id FROM proveedores WHERE id = ?', [proveedor_id]);
    if (!proveedores.length) throw new Error('PROVEEDOR_NO_EXISTE');

    const detalles = [];
    for (const item of productos) {
      const cantidad = Number(item.cantidad);
      if (!Number.isInteger(cantidad) || cantidad <= 0) throw new Error('CANTIDAD_INVALIDA');
      const [rows] = await connection.query(
        'SELECT id, precio, activo FROM productos WHERE id = ? FOR UPDATE',
        [item.producto_id]
      );
      if (!rows.length || !rows[0].activo) throw new Error(`PRODUCTO_NO_EXISTE:${item.producto_id}`);
      detalles.push({ producto_id: rows[0].id, cantidad, precio_unitario: rows[0].precio });
    }

    if (!detalles.length) throw new Error('ORDEN_SIN_PRODUCTOS');

    const [orden] = await connection.query(
      `INSERT INTO ordenes_compra (proveedor_id, usuario_id, estado) VALUES (?, ?, 'pendiente')`,
      [proveedor_id, usuario_id]
    );

    for (const detalle of detalles) {
      await connection.query(
        `INSERT INTO ordenes_compra_detalle (orden_id, producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [orden.insertId, detalle.producto_id, detalle.cantidad, detalle.precio_unitario]
      );
    }

    await connection.commit();
    return obtenerPorId(orden.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function obtenerTodos(estado) {
  let sql = `
    SELECT o.id, o.proveedor_id, p.nombre AS proveedor_nombre,
           o.usuario_id, u.nombre AS usuario_nombre, o.estado,
           o.fecha_creacion, o.fecha_recibido,
           COALESCE(SUM(d.cantidad * d.precio_unitario), 0) AS total,
           COALESCE(SUM(d.cantidad), 0) AS unidades
    FROM ordenes_compra o
    INNER JOIN proveedores p ON p.id = o.proveedor_id
    INNER JOIN usuarios u ON u.id = o.usuario_id
    LEFT JOIN ordenes_compra_detalle d ON d.orden_id = o.id`;
  const params = [];
  if (estado) {
    sql += ' WHERE o.estado = ?';
    params.push(estado);
  }
  sql += ' GROUP BY o.id ORDER BY o.fecha_creacion DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function obtenerPorId(id) {
  const [ordenes] = await pool.query(`
    SELECT o.id, o.proveedor_id, p.nombre AS proveedor_nombre,
           o.usuario_id, u.nombre AS usuario_nombre, o.estado,
           o.fecha_creacion, o.fecha_recibido
    FROM ordenes_compra o
    INNER JOIN proveedores p ON p.id = o.proveedor_id
    INNER JOIN usuarios u ON u.id = o.usuario_id
    WHERE o.id = ?`, [id]);
  if (!ordenes.length) return null;

  const [detalles] = await pool.query(`
    SELECT d.id, d.producto_id, pr.codigo, pr.nombre,
           d.cantidad, d.precio_unitario,
           (d.cantidad * d.precio_unitario) AS subtotal
    FROM ordenes_compra_detalle d
    INNER JOIN productos pr ON pr.id = d.producto_id
    WHERE d.orden_id = ?
    ORDER BY d.id`, [id]);

  const total = detalles.reduce((sum, d) => sum + Number(d.subtotal), 0);
  return { ...ordenes[0], detalles, total };
}

export async function cambiarEstado(id, nuevoEstado) {
  const estados = ['pendiente', 'completada', 'cancelada'];
  if (!estados.includes(nuevoEstado)) throw new Error('ESTADO_INVALIDO');

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [ordenes] = await connection.query(
      'SELECT id, estado FROM ordenes_compra WHERE id = ? FOR UPDATE', [id]
    );
    if (!ordenes.length) throw new Error('ORDEN_NO_EXISTE');
    const orden = ordenes[0];

    if (orden.estado === nuevoEstado) {
      await connection.commit();
      return obtenerPorId(id);
    }
    if (orden.estado !== 'pendiente') throw new Error('ORDEN_NO_MODIFICABLE');

    if (nuevoEstado === 'completada') {
      const [detalles] = await connection.query(
        'SELECT producto_id, cantidad FROM ordenes_compra_detalle WHERE orden_id = ?', [id]
      );
      for (const detalle of detalles) {
        const [resultado] = await connection.query(
          'UPDATE productos SET stock_actual = stock_actual + ? WHERE id = ? AND activo = TRUE',
          [detalle.cantidad, detalle.producto_id]
        );
        if (!resultado.affectedRows) throw new Error(`PRODUCTO_NO_EXISTE:${detalle.producto_id}`);
      }
      await connection.query(
        `UPDATE ordenes_compra SET estado = 'completada', fecha_recibido = CURRENT_TIMESTAMP WHERE id = ?`, [id]
      );
    } else {
      await connection.query('UPDATE ordenes_compra SET estado = ? WHERE id = ?', [nuevoEstado, id]);
    }

    await connection.commit();
    return obtenerPorId(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
