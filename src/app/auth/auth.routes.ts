import { Route } from "@angular/router"
import { LoginPage } from "./login/login"


export const authRoutes: Route[] = [

  {
    path: '',
    component: LoginPage,
  },

  {
    path: 'login',
    redirectTo: '',
    pathMatch: 'full',
  },

];
