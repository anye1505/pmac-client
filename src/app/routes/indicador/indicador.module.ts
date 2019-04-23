import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TreeModule } from 'angular-tree-component';
import { DndModule } from 'ng2-dnd';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { IndicadorGestionComponent } from './gestion/indicador-gestion.component';
import { IndicadorAmbientalComponent } from './ambiental/indicador-ambiental.component';
import { IndicadorAccesoComponent } from './acceso/indicador-acceso.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
/*
import { ComboChartComponent } from '../combo/bar-line/combo-chart.component';
import { ComboSeriesVerticalComponent } from '../combo/bar-line/combo-series-vertical.component';

import { StackedLineChartComponent } from '../combo/stacked-line/stacked-line-chart.component';
import { ComboSeriesVerticalStackedComponent } from '../combo/stacked-line/combo-series-vertical-stacked.component';
*/
import { ChartModule,HIGHCHARTS_MODULES  } from 'angular-highcharts';
import * as sankey from 'highcharts/modules/sankey.src';

import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';

//import { HighchartsStatic } from 'angular-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';

const hc = require('highcharts');
/*
export function highchartsFactory() {
    var hc = require('highcharts');
    var hcm = require('highcharts/highcharts-more');
    var sg = require('highcharts/modules/solid-gauge');
    hcm(hc);
    sg(hc);
    return hc;
}*/
/*
export function highchartsFactory() {
  const hc = require("highcharts");
  const dd = require("highcharts/modules/drilldown");
  const ex = require("highcharts/modules/exporting");
  const st = require("highcharts/modules/stock");
  const hm = require("highcharts/modules/heatmap");
  const tm = require("highcharts/modules/treemap");
  const th = require("highcharts/themes/dark-unica");

  dd(hc);
  ex(hc);
  st(hc);
  hm(hc);
  tm(hc);
  th(hc);

  return hc;
}
*/

export function highchartsFactory() {
  return highcharts;
}

const routes: Routes = [
    { path: 'gestion', component: IndicadorGestionComponent/*, 
        data: {
            permissions: {
               only: ['administrador'],
               redirectTo: 'home'
            }
        }*/
    },
    { path: 'ambiental', component: IndicadorAmbientalComponent/*, 
        data: {
            permissions: {
               only: ['administrador'],
               redirectTo: 'home'
            }
        }*/
    },
    { path: 'control-acceso', component: IndicadorAccesoComponent/*, 
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
        TreeModule,
        DndModule.forRoot(),
        InfiniteScrollModule,
        NgxDatatableModule,
        BsDatepickerModule.forRoot(),
        ChartModule
    ],
    declarations: [
        IndicadorGestionComponent,
        IndicadorAmbientalComponent,
        IndicadorAccesoComponent
       /* ComboChartComponent,
        ComboSeriesVerticalComponent,
        StackedLineChartComponent,
        ComboSeriesVerticalStackedComponent*/
    ],
    exports: [
        RouterModule,
        IndicadorGestionComponent,
        IndicadorAmbientalComponent,
        IndicadorAccesoComponent
      /*  ComboChartComponent,
        ComboSeriesVerticalComponent,
        StackedLineChartComponent,
        ComboSeriesVerticalStackedComponent*/
    ],
    providers: [
   /* {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }*/
   // {provide: HighchartsStatic, useFactory: highchartsFactory}
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ sankey,more, exporting ] } // add as factory to your providers
  ]
   /* ,providers: [
       
      ]*/
})
export class IndicadorModule { }
