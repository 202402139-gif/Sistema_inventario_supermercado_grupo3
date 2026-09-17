import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Proveedores as Service, Proveedor } from '../../services/proveedores';
import { Auth } from '../../services/auth';

@Component({selector:'app-proveedores',standalone:false,templateUrl:'./proveedores.html',styleUrl:'./proveedores.css'})
export class Proveedores implements OnInit {
  service = inject(Service);
  auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  proveedores: Proveedor[] = [];
  editando: number | null = null;
  error = '';
  mensaje = '';
  form: Proveedor = this.vacio();

  ngOnInit() { this.cargar(); }
  vacio(): Proveedor { return {nombre:'',contacto:'',telefono:'',email:'',direccion:''}; }

  cargar() {
    this.service.listar().subscribe({
      next: r => { this.proveedores = r; this.cdr.detectChanges(); },
      error: e => { this.error = e.error?.mensaje || 'Error al cargar proveedores.'; this.cdr.detectChanges(); }
    });
  }

  guardar() {
    const op = this.editando ? this.service.actualizar(this.editando, this.form) : this.service.crear(this.form);
    op.subscribe({
      next: () => { this.mensaje = this.editando ? 'Proveedor actualizado.' : 'Proveedor creado.'; this.cancelar(); this.cargar(); },
      error: e => { this.error = e.error?.mensaje || 'No se pudo guardar.'; this.cdr.detectChanges(); }
    });
  }

  editar(p: Proveedor) { this.editando = p.id!; this.form = {...p}; }
  cancelar() { this.editando = null; this.form = this.vacio(); }
  eliminar(id: number) {
    if (confirm('¿Eliminar este proveedor?')) {
      this.service.eliminar(id).subscribe({
        next: () => this.cargar(),
        error: e => { this.error = e.error?.mensaje || 'No se pudo eliminar.'; this.cdr.detectChanges(); }
      });
    }
  }
}