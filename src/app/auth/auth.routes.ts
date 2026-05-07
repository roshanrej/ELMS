import { Route } from "@angular/router"
import { Login } from "./login/login"


export const authRoutes : Route[] =[
    { path: 'login', redirectTo: '', pathMatch: 'full'},
    { path:'', component: Login },
    
]