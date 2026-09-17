import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Resumen { productos:number; proveedores:number; ordenes:number; pendientes:number; completadas:number; canceladas:number; }
export interface StockBajo { id:number; codigo:string; nombre:string; stock_actual:number; stock_minimo:number; categoria_nombre?:string; }
export interface OrdenMes { mes:string; total:number; pendientes:number; completadas:number; canceladas:number; }
@Injectable({providedIn:'root'}) export class Dashboard {
 private http=inject(HttpClient); private api='http://localhost:4000/api/dashboard';
 resumen(){return this.http.get<Resumen>(`${this.api}/resumen`);} stockBajo(){return this.http.get<StockBajo[]>(`${this.api}/stock-bajo`);} ordenesPorMes(){return this.http.get<OrdenMes[]>(`${this.api}/ordenes-por-mes`);}
}
