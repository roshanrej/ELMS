import { Route } from "@angular/router"
import { Login } from "./login/login"
import { Register } from "./register/register"

export const authRoutes : Route[] =[
    { path: 'login', redirectTo: '', pathMatch: 'full'},
    { path:'', component: Login },
    {path:'register',component: Register}
]