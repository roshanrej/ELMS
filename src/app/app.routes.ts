
import { Route } from '@angular/router';

export const routes : Route[]=[
    
{
    path:'',
    loadChildren:()=> import('./auth/auth.routes').then(r=>r.authRoutes)
 
},
{
  path: 'admin',
  loadChildren: ()=> import('./features/admin/admin.routes').then( m=>m.adminRoutes )
}]