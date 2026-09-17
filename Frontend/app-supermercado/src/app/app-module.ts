import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Productos } from './pages/productos/productos';
import { Proveedores } from './pages/proveedores/proveedores';
import { OrdenesCompra } from './pages/ordenes-compra/ordenes-compra';
import { Dashboard } from './pages/dashboard/dashboard';
import { Navar } from './shared/navar/navar';
import { Sidebar } from './shared/sidebar/sidebar';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
@NgModule({
 declarations:[App,Login,Registro,Productos,Proveedores,OrdenesCompra,Dashboard,Navar,Sidebar],
 imports:[BrowserModule,FormsModule,ReactiveFormsModule,AppRoutingModule],
 providers:[provideBrowserGlobalErrorListeners(),provideHttpClient(withInterceptors([jwtInterceptor]))],
 bootstrap:[App]
}) export class AppModule {}
