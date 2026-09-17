import { Component, inject } from '@angular/core'; import { Auth } from '../../services/auth';
@Component({selector:'app-navar',standalone:false,templateUrl:'./navar.html',styleUrl:'./navar.css'}) export class Navar { auth=inject(Auth); }
