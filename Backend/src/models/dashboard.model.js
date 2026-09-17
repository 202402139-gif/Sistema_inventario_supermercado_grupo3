import { pool } from '../db.js';

export async function obtenerResumen() {
  const [[productos]] = await pool.query('SELECT COUNT(*) AS total FROM productos WHERE activo = TRUE');
  const [[proveedores]] = await pool.query('SELECT COUNT(*) AS total FROM proveedores');
  const [[ordenes]] = await pool.query('SELECT COUNT(*) AS total FROM ordenes_compra');
  const [[pendientes]] = await pool.query("SELECT COUNT(*) AS total FROM ordenes_compra WHERE estado = 'pendiente'");
  const [[completadas]] = await pool.query("SELECT COUNT(*) AS total FROM ordenes_compra WHERE estado = 'completada'");
  const [[canceladas]] = await pool.query("SELECT COUNT(*) AS total FROM ordenes_compra WHERE estado = 'cancelada'");
  return {
    productos: Number(productos.total),
    proveedores: Number(proveedores.total),
    ordenes: Number(ordenes.total),
    pendientes: Number(pendientes.total),
    completadas: Number(completadas.total),
    canceladas: Number(canceladas.total)
  };
}

export async function obtenerStockBajo() {
  const [rows] = await pool.query(`
    SELECT p.id, p.codigo, p.nombre, p.stock_actual, p.stock_minimo,
           c.nombre AS categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON c.id = p.categoria_id
    WHERE p.activo = TRUE AND p.stock_actual < p.stock_minimo
    ORDER BY p.stock_actual ASC, p.nombre ASC`);
  return rows;
}

export async function obtenerOrdenesPorMes() {
  const [rows] = await pool.query(`
    SELECT DATE_FORMAT(fecha_creacion, '%Y-%m') AS mes,
           COUNT(*) AS total,
           SUM(estado = 'pendiente') AS pendientes,
           SUM(estado = 'completada') AS completadas,
           SUM(estado = 'cancelada') AS canceladas
    FROM ordenes_compra
    WHERE fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
    GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m')
    ORDER BY mes ASC`);
  return rows.map(r => ({
    mes: r.mes,
    total: Number(r.total),
    pendientes: Number(r.pendientes || 0),
    completadas: Number(r.completadas || 0),
    canceladas: Number(r.canceladas || 0)
  }));
}
