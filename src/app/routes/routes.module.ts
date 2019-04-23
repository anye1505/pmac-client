import { NgModule } from '@angular/core';
import { RouterModule , PreloadAllModules} from '@angular/router';
import { TranslatorService } from '../core/translator/translator.service';
import { MenuService } from '../core/menu/menu.service';
import { SharedModule } from '../shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { UserModule } from './user/user.module';
import { MapaModule } from './mapa/mapa.module';
import { IndicadorModule } from './indicador/indicador.module';


import { menu } from './menu';
import { routes } from './routes';

import { AuthGuard }   from '../services/auth-guard.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { MapaService } from '../services/mapa.service';
import { IndicadorService } from '../services/indicador.service';

import { NgxPermissionsService } from 'ngx-permissions';

import { AppCustomPreloader } from './app-routing-loader';
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules ,useHash: true }),
        PagesModule,
        UserModule,
        MapaModule,
        IndicadorModule
    ],
    declarations: [],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        UserService,
        RoleService,
        NgxPermissionsService,
        MapaService,
        IndicadorService
    ]
})


export class RoutesModule {
    constructor(public menuService: MenuService, tr: TranslatorService) {
        menuService.addMenu(menu);
    }
}
