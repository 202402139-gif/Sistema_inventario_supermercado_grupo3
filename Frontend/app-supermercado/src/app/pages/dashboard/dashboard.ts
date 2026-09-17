import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Dashboard as DashboardService, Resumen, StockBajo, OrdenMes } from '../../services/dashboard';

@Component({selector:'app-dashboard',standalone:false,templateUrl:'./dashboard.html',styleUrl:'./dashboard.css'})
export class Dashboard implements OnInit {
  service = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  resumen?: Resumen;
  bajos: StockBajo[] = [];
  meses: OrdenMes[] = [];
  error = '';
  max = 1;

  ngOnInit() {
    this.service.resumen().subscribe({
      next: r => { this.resumen = r; this.cdr.detectChanges(); },
      error: e => { this.error = e.error?.mensaje || 'Error al cargar dashboard.'; this.cdr.detectChanges(); }
    });
    this.service.stockBajo().subscribe({
      next: r => { this.bajos = r; this.cdr.detectChanges(); }
    });
    this.service.ordenesPorMes().subscribe({
      next: r => { this.meses = r; this.max = Math.max(1, ...r.map(x => x.total)); this.cdr.detectChanges(); }
    });
  }
}