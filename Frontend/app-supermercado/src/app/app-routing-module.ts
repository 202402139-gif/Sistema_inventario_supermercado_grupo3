import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { Proveedores } from './pages/proveedores/proveedores';
import { OrdenesCompra } from './pages/ordenes-compra/ordenes-compra';
import { authGuard } from './guards/auth.guard';

const routes:Routes=[
 {path:'login',component:Login},{path:'registro',component:Registro},
 {path:'dashboard',component:Dashboard,canActivate:[authGuard]},
 {path:'productos',component:Productos,canActivate:[authGuard]},
 {path:'proveedores',component:Proveedores,canActivate:[authGuard]},
 {path:'ordenes',component:OrdenesCompra,canActivate:[authGuard]},
 {path:'',pathMatch:'full',redirectTo:'dashboard'},{path:'**',redirectTo:'dashboard'}
];
@NgModule({imports:[RouterModule.forRoot(routes)],exports:[RouterModule]}) export class AppRoutingModule {}
