import { Routes } from '@angular/router';
import { MapaComponent } from './mapa/mapa.component';
import { FormViajeComponent } from './form-viaje/form-viaje.component';
import { ListaViajesComponent } from './lista-viajes/lista-viajes.component';
import { ListaTrenesComponent } from './lista-trenes/lista-trenes.component';
import { ListaEmpleadosComponent } from './lista-empleados/lista-empleados.component';
import { FormEmpleadosComponent } from './form-empleados/form-empleados.component';
import { NavegacionComponent } from './navegacion/navegacion.component';
import { ListaEstacionesComponent } from './lista-estaciones/lista-estaciones.component';
import { ListaRutasComponent } from './lista-rutas/lista-rutas.component';

export const routes: Routes = [
    
    // Ruta por defecto redirige a login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Ruta de login sin layout
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: "menu",
        component: NavegacionComponent,
        children:[
            {
                path: "viajes",
                component: MapaComponent
            },
            {
                path: "viajes/lista",
                component: ListaViajesComponent
            },
            {
                path: "viajes/post",
                component: FormViajeComponent
            },
            {
                path: "trenes",
                component: ListaTrenesComponent
            },
            {
                path: "empleados",
                component: ListaEmpleadosComponent
            },
            {
                path: "empleados/post",
                component: FormEmpleadosComponent
            },
            {
                path: "rutas",
                component: ListaRutasComponent
            },
            {
                path: "estaciones",
                component: ListaEstacionesComponent
            },
            {
                path: 'empleados/editar/:id',
                loadComponent: () => import('./form-empleados/form-empleados.component')
                    .then(m => m.FormEmpleadosComponent)
            }
        ]
    },
];
