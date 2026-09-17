import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
export interface DetalleOrden { producto_id:number; codigo?:string; nombre?:string; cantidad:number; precio_unitario?:number; subtotal?:number; }
export interface Orden { id:number; proveedor_id:number; proveedor_nombre:string; usuario_nombre?:string; estado:string; fecha_creacion:string; fecha_recibido?:string; detalles?:DetalleOrden[]; total?:number; unidades?:number; }
@Injectable({providedIn:'root'}) export class OrdenesCompra {
 private http=inject(HttpClient); private api='http://localhost:4000/api/ordenes';
 listar(estado=''){let p=new HttpParams(); if(estado)p=p.set('estado',estado); return this.http.get<Orden[]>(this.api,{params:p});}
 obtener(id:number){return this.http.get<Orden>(`${this.api}/${id}`);}
 crear(data:{proveedor_id:number;productos:DetalleOrden[]}){return this.http.post<Orden>(this.api,data);}
 cambiarEstado(id:number,estado:string){return this.http.patch<{mensaje:string;orden:Orden}>(`${this.api}/${id}/estado`,{estado});}
}
