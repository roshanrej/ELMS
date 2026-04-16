
import { Route } from '@angular/router';
import { Sidebar } from './shared/components/sidebar/sidebar';

export const routes : Route[]=[
    
{
    path:'',
    loadChildren:()=> import('./auth/auth.routes').then(r=>r.authRoutes)
 
},
{
  path:'\sidebar',
  component:Sidebar
}
]