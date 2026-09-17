import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Proveedor { id?:number; nombre:string; contacto?:string; telefono?:string; email?:string; direccion?:string; }
@Injectable({providedIn:'root'}) export class Proveedores {
 private http=inject(HttpClient); private api='http://localhost:4000/api/proveedores';
 listar(){return this.http.get<Proveedor[]>(this.api);} crear(p:Proveedor){return this.http.post<Proveedor>(this.api,p);} actualizar(id:number,p:Proveedor){return this.http.put<Proveedor>(`${this.api}/${id}`,p);} eliminar(id:number){return this.http.delete(`${this.api}/${id}`);}
}
