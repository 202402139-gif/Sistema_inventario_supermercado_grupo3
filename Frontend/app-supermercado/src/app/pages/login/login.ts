import { Component, inject } from '@angular/core'; import { Router } from '@angular/router'; import { Auth } from '../../services/auth';
@Component({selector:'app-login',standalone:false,templateUrl:'./login.html',styleUrl:'./login.css'}) export class Login { auth=inject(Auth); router=inject(Router); email='';password='';error='';loading=false;
 entrar(){this.error='';this.loading=true;this.auth.login(this.email,this.password).subscribe({next:()=>this.router.navigate(['/dashboard']),error:e=>{this.error=e.error?.mensaje||'No se pudo iniciar sesión.';this.loading=false;}})} }
