import { AuthGuard }                from '../services/auth-guard.service';

import { LayoutComponent } from '../layout/layout.component';


import { LoginComponent } from './pages/login/login.component';
import { RecoverComponent } from './pages/recover/recover.component';
import { LockComponent } from './pages/lock/lock.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';

import { NgxPermissionsGuard } from 'ngx-permissions';
export const routes = [

    {
        path: '',
        component: LayoutComponent,
        canActivate:[AuthGuard],
        canActivateChild:[NgxPermissionsGuard],
        children: [
            { path: '', data: { preload: true }, redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', data: { preload: true }, loadChildren: './home/home.module#HomeModule' },
            { path: 'user', data: { preload: true }, loadChildren: './user/user.module#UserModule' },
            { path: 'mapa', data: { preload: true }, loadChildren: './mapa/mapa.module#MapaModule' },            
            { path: 'indicador', data: { preload: true }, loadChildren: './indicador/indicador.module#IndicadorModule' }
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'recover', component: RecoverComponent },
    { path: 'lock', component: LockComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Error404Component },
    { path: '500', component: Error500Component },
    // Not found,

    { path: '**', redirectTo: '404' }

];
