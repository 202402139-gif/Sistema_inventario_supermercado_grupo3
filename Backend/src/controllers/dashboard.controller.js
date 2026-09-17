import * as DashboardModel from '../models/dashboard.model.js';

export async function resumen(req, res) {
  try { return res.status(200).json(await DashboardModel.obtenerResumen()); }
  catch (error) { console.error('Error dashboard resumen:', error); return res.status(500).json({ mensaje: 'Error interno del dashboard.' }); }
}

export async function stockBajoDashboard(req, res) {
  try { return res.status(200).json(await DashboardModel.obtenerStockBajo()); }
  catch (error) { console.error('Error dashboard stock:', error); return res.status(500).json({ mensaje: 'Error interno al obtener stock bajo.' }); }
}

export async function ordenesPorMes(req, res) {
  try { return res.status(200).json(await DashboardModel.obtenerOrdenesPorMes()); }
  catch (error) { console.error('Error dashboard gráfico:', error); return res.status(500).json({ mensaje: 'Error interno al obtener gráfico.' }); }
}
