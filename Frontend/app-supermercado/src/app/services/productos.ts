import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Producto { id?: number; codigo: string; nombre: string; descripcion?: string; precio: number; stock_minimo: number; stock_actual: number; categoria_id?: number | null; categoria_nombre?: string; alerta_stock_bajo?: boolean; }
@Injectable({providedIn:'root'}) export class Productos {
  private http=inject(HttpClient); private api='http://localhost:4000/api/productos';
  listar():Observable<Producto[]> { return this.http.get<Producto[]>(this.api); }
  crear(p:Producto){return this.http.post<Producto>(this.api,p);}
  actualizar(id:number,p:Producto){return this.http.put<Producto>(`${this.api}/${id}`,p);}
  eliminar(id:number){return this.http.delete(`${this.api}/${id}`);}
}
