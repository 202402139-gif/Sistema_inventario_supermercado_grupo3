import { pool } from '../db.js';

export async function obtenerTodos() {
  const [rows] = await pool.query('SELECT * FROM proveedores ORDER BY nombre ASC');
  return rows;
}

export async function obtenerPorId(id) {
  const [rows] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
  return rows[0];
}

export async function crear({ nombre, contacto, telefono, email, direccion }) {
  const [result] = await pool.query(
    'INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)',
    [nombre, contacto, telefono, email || null, direccion]
  );
  return obtenerPorId(result.insertId);
}

export async function actualizar(id, { nombre, contacto, telefono, email, direccion }) {
  await pool.query(
    'UPDATE proveedores SET nombre=?, contacto=?, telefono=?, email=?, direccion=? WHERE id=?',
    [nombre, contacto, telefono, email || null, direccion, id]
  );
  return obtenerPorId(id);
}

export async function eliminar(id) {
  const [result] = await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);
  return result.affectedRows > 0;
}