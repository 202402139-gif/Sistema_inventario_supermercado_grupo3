import { Component, inject } from '@angular/core';
import { Auth } from './services/auth';
@Component({selector:'app-root',templateUrl:'./app.html',standalone:false,styleUrl:'./app.css'}) export class App { auth=inject(Auth); }
