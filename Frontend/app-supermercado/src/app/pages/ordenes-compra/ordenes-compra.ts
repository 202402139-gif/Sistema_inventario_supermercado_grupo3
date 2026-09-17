import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { OrdenesCompra as Service, Orden, DetalleOrden } from '../../services/ordenes-compra';
import { Proveedores, Proveedor } from '../../services/proveedores';
import { Productos, Producto } from '../../services/productos';

@Component({selector:'app-ordenes-compra',standalone:false,templateUrl:'./ordenes-compra.html',styleUrl:'./ordenes-compra.css'})
export class OrdenesCompra implements OnInit {
  service = inject(Service);
  provService = inject(Proveedores);
  prodService = inject(Productos);
  private cdr = inject(ChangeDetectorRef);
  ordenes: Orden[] = [];
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  filtro = '';
  error = '';
  mensaje = '';
  proveedor_id: number | null = null;
  producto_id: number | null = null;
  cantidad = 1;
  detalles: DetalleOrden[] = [];

  ngOnInit() {
    this.cargar();
    this.provService.listar().subscribe(r => { this.proveedores = r; this.cdr.detectChanges(); });
    this.prodService.listar().subscribe(r => { this.productos = r; this.cdr.detectChanges(); });
  }

  cargar() {
    this.service.listar(this.filtro).subscribe({
      next: r => { this.ordenes = r; this.cdr.detectChanges(); },
      error: e => { this.error = e.error?.mensaje || 'Error al cargar órdenes.'; this.cdr.detectChanges(); }
    });
  }

  agregar() {
    if (!this.producto_id || this.cantidad < 1) return;
    const p = this.productos.find(x => x.id === Number(this.producto_id));
    if (!p) return;
    const existente = this.detalles.find(x => x.producto_id === p.id);
    if (existente) existente.cantidad += Number(this.cantidad);
    else this.detalles.push({producto_id: p.id!, cantidad: Number(this.cantidad), nombre: p.nombre, precio_unitario: p.precio});
    this.producto_id = null;
    this.cantidad = 1;
  }

  quitar(i: number) { this.detalles.splice(i, 1); }

  crear() {
    this.error = '';
    if (!this.proveedor_id || !this.detalles.length) { this.error = 'Selecciona un proveedor y agrega productos.'; return; }
    this.service.crear({proveedor_id: Number(this.proveedor_id), productos: this.detalles.map(d => ({producto_id: d.producto_id, cantidad: d.cantidad}))}).subscribe({
      next: () => { this.mensaje = 'Orden creada correctamente.'; this.proveedor_id = null; this.detalles = []; this.cargar(); },
      error: e => { this.error = e.error?.mensaje || 'No se pudo crear la orden.'; this.cdr.detectChanges(); }
    });
  }

  cambiar(id: number, estado: string) {
    this.service.cambiarEstado(id, estado).subscribe({
      next: () => { this.mensaje = estado === 'completada' ? 'Orden recibida: el stock fue actualizado.' : 'Estado actualizado.'; this.cargar(); },
      error: e => { this.error = e.error?.mensaje || 'No se pudo cambiar el estado.'; this.cdr.detectChanges(); }
    });
  }
}