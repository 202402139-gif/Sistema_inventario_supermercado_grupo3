import { pool } from '../db.js';

export async function obtenerTodos() {
  const [rows] = await pool.query(`
    SELECT p.*, c.nombre AS categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.activo = TRUE
    ORDER BY p.nombre ASC
  `);
  return rows;
}

export async function obtenerStockBajo() {
  const [rows] = await pool.query(`
    SELECT p.*, c.nombre AS categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.activo = TRUE AND p.stock_actual < p.stock_minimo
    ORDER BY p.stock_actual ASC
  `);
  return rows;
}

export async function obtenerPorId(id) {
  const [rows] = await pool.query(`
    SELECT p.*, c.nombre AS categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?
  `, [id]);
  return rows[0];
}

export async function obtenerPorCodigo(codigo) {
  const [rows] = await pool.query('SELECT id FROM productos WHERE codigo = ?', [codigo]);
  return rows[0];
}

export async function crear({ codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id }) {
  const [result] = await pool.query(
    `INSERT INTO productos (codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [codigo, nombre, descripcion || null, precio, stock_minimo || 0, stock_actual || 0, categoria_id || null]
  );
  return obtenerPorId(result.insertId);
}

export async function actualizar(id, { codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id }) {
  await pool.query(
    `UPDATE productos SET codigo=?, nombre=?, descripcion=?, precio=?, stock_minimo=?, stock_actual=?, categoria_id=? WHERE id=?`,
    [codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id, id]
  );
  return obtenerPorId(id);
}

export async function eliminar(id) {
  const [result] = await pool.query('UPDATE productos SET activo = FALSE WHERE id = ?', [id]);
  return result.affectedRows > 0;
}