import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Productos as ProductoService, Producto } from '../../services/productos';
import { Auth } from '../../services/auth';

@Component({selector:'app-productos',standalone:false,templateUrl:'./productos.html',styleUrl:'./productos.css'})
export class Productos implements OnInit {
  service = inject(ProductoService);
  auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  productos: Producto[] = [];
  editando: number | null = null;
  mensaje = '';
  error = '';
  form: Producto = this.vacio();

  ngOnInit() { this.cargar(); }
  vacio(): Producto { return {codigo:'',nombre:'',descripcion:'',precio:0,stock_minimo:0,stock_actual:0,categoria_id:null}; }

  cargar() {
    this.service.listar().subscribe({
      next: r => { this.productos = r; this.cdr.detectChanges(); },
      error: e => { this.error = e.error?.mensaje || 'Error al cargar productos.'; this.cdr.detectChanges(); }
    });
  }

  guardar() {
    this.error = '';
    const op = this.editando ? this.service.actualizar(this.editando, this.form) : this.service.crear(this.form);
    op.subscribe({
      next: () => { this.mensaje = this.editando ? 'Producto actualizado.' : 'Producto creado.'; this.cancelar(); this.cargar(); },
      error: e => { this.error = e.error?.mensaje || 'No se pudo guardar.'; this.cdr.detectChanges(); }
    });
  }

  editar(p: Producto) { this.editando = p.id!; this.form = {...p}; this.mensaje = ''; }
  cancelar() { this.editando = null; this.form = this.vacio(); }
  eliminar(id: number) {
    if (confirm('¿Eliminar este producto?')) {
      this.service.eliminar(id).subscribe({
        next: () => this.cargar(),
        error: e => { this.error = e.error?.mensaje || 'No se pudo eliminar.'; this.cdr.detectChanges(); }
      });
    }
  }
}