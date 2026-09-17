import { pool } from '../db.js';

export async function buscarPorEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

export async function crearUsuario({ nombre, email, contrasenaHash, rol }) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, contrasenaHash, rol]
  );
  return { id: result.insertId, nombre, email, rol };
}