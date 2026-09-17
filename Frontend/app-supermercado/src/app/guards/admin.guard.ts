import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
export const adminGuard: CanActivateFn = () => {
 const usuario=JSON.parse(localStorage.getItem('usuario') || 'null');
 return usuario?.rol === 'administrador' ? true : inject(Router).createUrlTree(['/dashboard']);
};
