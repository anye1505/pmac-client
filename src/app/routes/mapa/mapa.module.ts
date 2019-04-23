import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TreeModule } from 'angular-tree-component';
import { DndModule } from 'ng2-dnd';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../../shared/shared.module';

import { MapaComponent } from './mapa/mapa.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const routes: Routes = [
    { path: 'index', component: MapaComponent/*, 
        data: {
            permissions: {
               only: ['administrador'],
               redirectTo: 'home'
            }
        }*/
    }
];


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBNs42Rt_CyxAqdbIBK0a5Ut83QiauESPA'
        }),
        TreeModule,
        DndModule.forRoot(),
        InfiniteScrollModule,
        NgxDatatableModule,
           BsDatepickerModule.forRoot()
    ],
    declarations: [
        MapaComponent
    ],
    exports: [
        RouterModule,
        MapaComponent
    ]
})
export class MapaModule { }
