import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';

export const routes: Routes = [
{ path: '', redirectTo: 'login', pathMatch: 'full' }, // startupPage
{path: '', children: authRoutes,
}, // authroutes

    
];
