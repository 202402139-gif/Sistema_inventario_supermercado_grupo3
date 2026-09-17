import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface Usuario { id: number; nombre: string; email: string; rol: string; }
export interface LoginResponse { mensaje: string; token: string; usuario: Usuario; }

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = 'http://localhost:4000/api/auth';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { email, password }).pipe(
      tap(r => { localStorage.setItem('token', r.token); localStorage.setItem('usuario', JSON.stringify(r.usuario)); })
    );
  }
  register(data: { nombre: string; email: string; password: string; rol?: string }) { return this.http.post(`${this.api}/register`, data); }
  logout() { localStorage.removeItem('token'); localStorage.removeItem('usuario'); this.router.navigate(['/login']); }
  token() { return localStorage.getItem('token'); }
  usuario(): Usuario | null { try { return JSON.parse(localStorage.getItem('usuario') || 'null'); } catch { return null; } }
  isAuthenticated() { return !!this.token(); }
}
