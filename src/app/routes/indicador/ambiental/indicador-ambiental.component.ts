import { Component, OnInit,ViewChild, Input,Output,ContentChild,EventEmitter,TemplateRef } from '@angular/core';
import { Router }      from '@angular/router';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { IndicadorService } from '../../../services/indicador.service';

import { GLOBAL } from '../../../global';

import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import * as $ from 'jquery';



import { BsModalService,ModalDirective } from 'ngx-bootstrap/modal';

//import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
/*
import {  NgxChartsModule, BaseChartComponent, LineComponent, LineSeriesComponent,
  calculateViewDimensions, ViewDimensions, ColorHelper } from '@swimlane/ngx-charts';


import { area, line, curveLinear } from 'd3-shape';
import { scaleBand, scaleLinear, scalePoint, scaleTime } from 'd3-scale';*/
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*

import { ComboChartComponent } from '../../combo/bar-line/combo-chart.component';
import { ComboSeriesVerticalComponent } from '../../combo/bar-line/combo-series-vertical.component';


import { StackedLineChartComponent } from '../../combo/stacked-line/stacked-line-chart.component';
import { ComboSeriesVerticalStackedComponent } from '../../combo/stacked-line/combo-series-vertical-stacked.component';
*/
import { Chart } from 'angular-highcharts';

@Component({
    selector: 'indicador-ambiental',
    templateUrl: './indicador-ambiental.component.html',
    styleUrls: ['./indicador-ambiental.component.scss']

})

export class IndicadorAmbientalComponent  implements OnInit  {
  public anios:any[] = [];
  public meses = [
      {name:'Enero',value:'01'},
      {name:'Febrero',value:'02'},
      {name:'Marzo',value:'03'},
      {name:'Abril',value:'04'},
      {name:'Mayo',value:'05'},
      {name:'Junio',value:'06'},
      {name:'Julio',value:'07'},
      {name:'Agosto',value:'08'},
      {name:'Setiembre',value:'09'},
      {name:'Octubre',value:'10'},
      {name:'Noviembre',value:'11'},
      {name:'Diciembre',value:'12'}
    ];



   /* public single: any[];
    public multi: any[];
    public multiComunidad:any;*/
    //public pie:any[];

    //public view: any[] = [650, 300];

   /* // options
    public showXAxis = true;
    public showYAxis = true;  
    public gradient = false;
    public showLegend = true;
    public showXAxisLabel = true;
    public xAxisLabel = 'Año / Mes';
    public showYAxisLabel = true;
    public yAxisLabel = 'cantidad';

    public colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    public showLabels = true;
    public explodeSlices = true;
    public doughnut = true;
*/
    public rows = [];
    public loadingIndicator: boolean = true;
    public reorderable: boolean = true;

    public columns = [ ];

    public formLoading:boolean;
    /*Form*/
    public formBuscar: FormGroup;
    public ambiental_comunidad  =  [];
    public ambiental_tipo_observacion  =  [];
    public geotecnico_comunidad  =  [];
    public geotecnico_tipo_observacion  =  [];
    public categoria_observacion  =  [];
    public comunidades  =  [];
    public tipo_observacion  =  [];


    public toasActive;
    public toaster: any;
    public toasterConfig: any;
    public toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });
    /*Colores de gráficos*/
    public colorCualitativo = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

    /**/
 /* public resultComboStacked:boolean = false;
    public barChartStacked : any[];
    public lineChartSeriesStacked: any[];*/
 /**/
/*  public resultCombo:boolean = false;
  public barChart: any[];
  public lineChartSeries: any[];
  public lineChartScheme = {
    name: 'coolthree',
    selectable: true,
    group: 'Ordinal',
    domain: [
      '#01579b', '#7aa3e5', '#a8385d', '#00bfa5'
    ]
  };

  public comboBarScheme = {
    name: 'singleLightBlue',
    selectable: true,
    group: 'Ordinal',
    domain: [
      '#01579b'
    ]
  };

  showRightYAxisLabel: boolean = true;
  yAxisLabelRight: string = 'Utilization';
*/
  /**/

  public chartObservacion: Chart;
  public chartObservacionNueva: Chart;
  public chartObservacionTipo: Chart;
  public chartPie:Chart;
  public chart1:Chart;
  public chart2:Chart;
  public chart3:Chart;
  
constructor(
        public settings: SettingsService,
        fb: FormBuilder,
        private router: Router,
        public toasterService: ToasterService,
        public _indicadorService:IndicadorService

        
     ) {
        //this.single =  [];
        //Object.assign(this, { single })
        //this.multi = [];


        this.formLoading = false;

        let anioActual = new Date().getUTCFullYear();

        for(let i =anioActual  ;i >= 2010; i--){
          this.anios.push({name:i,value:i});
        }
        this.formBuscar = fb.group({
            /*'desde': ['', Validators.compose([CustomValidators.date])],
            'hasta': ['', Validators.compose([CustomValidators.date])],*/
            'desde_anio': [2010, Validators.compose([Validators.required])],
            'desde_mes': ['11', Validators.compose([Validators.required])],
            'hasta_anio': [anioActual, Validators.compose([Validators.required])],
            'hasta_mes': ['12', Validators.compose([Validators.required])],
            //'categoria_observacion': ['', Validators.compose([Validators.required])],
            'comunidad': [[], Validators.compose([])],
            //'tipo_observacion': [[], Validators.compose([])]
        });
    }


    ngOnInit() {
/*
    $( window ).resize(function() {
  $( "#log" ).append( "<div>Handler for .resize() called.</div>" );
});*/
        this.formLoading = true;
        this._indicadorService.param(
            {},
            data=>{
              if(data.error){
                  this.showMessage('error', data.mensaje, '');
              }else{

                this.ambiental_comunidad  =  data.datos.ambiental_comunidad;
                this.ambiental_tipo_observacion  =  data.datos.ambiental_tipo_observacion;
                this.geotecnico_comunidad  =  data.datos.geotecnico_comunidad;
                //this.geotecnico_tipo_observacion  =  data.datos.geotecnico_tipo_observacion;
                //this.categoria_observacion  =  data.datos.categoria_observacion;
                //console.log(this.categoria_observacion);
              }
              this.formLoading = false;
            },error=>{
              this.showMessage('error', 'Vuelva a intentar en unos minutos', '');
              this.formLoading = false;
            }
        )    

      
    }


    submitFormAmbiental($ev, value: any) {
      
        $ev.preventDefault();
        for (let c in this.formBuscar.controls) {
            this.formBuscar.controls[c].markAsTouched();
        }
        if (this.formBuscar.valid) {     
          this.formLoading=true;  
          
          if(value.desde_anio !=null && value.desde_mes != null && value.desde_anio !='' && value.desde_mes != ''){
            value.desde = value.desde_anio+""+value.desde_mes;
          }

          if(value.hasta_anio !=null && value.hasta_mes != null && value.hasta_anio !='' && value.hasta_mes != ''){
            value.hasta = value.hasta_anio+""+value.hasta_mes;
          }


          this._indicadorService.consulta(
              value,
              data=>{
                if(data.error){
                  this.showMessage('error',data.mensaje,'');
                }else{   
                  this.formLoading=false;  
                  this.rows = [];
                  this.columns = [{ prop:'comunidad', sortable: false }];


                  /*  let mensual=[];
                  let mensualTiempo = [];

                  let mensualSingle = [];
                  let mensualSingleAcum = [];*/

                  let comunidades = [];
                  /*let pieTemp = [{
                    name:'Resueltos',
                    value:0
                  },{
                    name:'No resueltos',
                    value:0
                  }];*/

                  let pieTemp:any[] =[['Leve',0],['Regular',0],['Grave',0]];
                  let gridNoResueltos:any[];

                  let categoriesObservacion = [];
                  let observacion = [
                    {
                      type:'column',
                      name:'Obs. resueltas',
                      yAxis: 1,
                      data:[]
                    },{
                      type:'column',
                      name:'Obs. no Resueltas',
                      yAxis: 1,
                      data:[]                      
                    },{
                      type: 'spline',
                      name: 'Tiempo resolución',
                      data: [],
                      marker: {
                        lineWidth: 2,
                        //lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'black'
                      }
                    }
                  ];
                  
                  let categoriesObservacionNueva = [ ];
                  let observacionNueva = [                    
                      {
                      type:'column',
                      name:'Observaciones nuevas',
                      yAxis: 1,
                      data:[]
                    },{
                      type: 'spline',
                      name: 'Acumulado',
                      data: [],
                      marker: {
                        lineWidth: 2,
                        //lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'black'
                      }
                    }
                  ];


                  let categoriesObservacionTipo = [ ];
                  let observacionTipo = [];
                  /*
                   [{
                        name: 'John',
                        data: [5, 3, 4, 7, 2]
                    }, {
                        name: 'Jane',
                        data: [2, 2, 3, 2, 1]
                    }, {
                        name: 'Joe',
                        data: [3, 4, 4, 2, 5]
                    }]*/

                  let pos = -1;

                  for(let i=0;i<data.mensual.length;i++){
                    categoriesObservacion.push(data.mensual[i].mes+"");
                    observacion[0].data.push(data.mensual[i].resueltos);
                    observacion[1].data.push(data.mensual[i].no_resueltos);
                    observacion[2].data.push(data.mensual[i].tiempo_resolucion);

                    categoriesObservacionNueva.push(data.mensual[i].mes+"");
                    observacionNueva[0].data.push(data.mensual[i].nro_observaciones_nuevas);
                    observacionNueva[1].data.push((i>0?observacionNueva[1].data[i-1]:0)+data.mensual[i].nro_observaciones_nuevas);
                   

                    
                  }
                  //pieTemp[0][1] = data.mensual[data.mensual.length-1].resueltos;
                  //pieTemp[1][1] = data.mensual[data.mensual.length-1].no_resueltos;

                  let posCom=-1;
                  for(let i=0;i<data.comunidad.length;i++){

                    posCom = -1;
                    for(let j=0;j<this.columns.length;j++){
                      if(this.columns[j].name == data.comunidad[i].tipo_observacion){
                        posCom = j;
                        break;
                      }

                    }
                    if(posCom < 0){
                      posCom = this.columns.length;
                    
                      this.columns.push( {prop:data.comunidad[i].tipo_observacion,  sortable: false, name: data.comunidad[i].tipo_observacion});

                    
                      observacionTipo.push({
                        name:data.comunidad[i].tipo_observacion,
                        data:[]
                      });

                    }



                    pos=-1;
                    let comunidad
                    for(let j=0;j<comunidades.length;j++){
                      if(comunidades[j].name == data.comunidad[i].comunidad){
                        pos = j;
                        break;
                      }
                    }

                    if(pos >= 0){
                      comunidades[pos].series.push({
                          name:data.comunidad[i].tipo_observacion,
                          value:data.comunidad[i].resueltos                               
                      });


                      observacionTipo[posCom-1].data[pos] = data.comunidad[i].resueltos;
                      
                      for(let jj =0;jj<this.rows.length;jj++){
                        if(this.rows[jj].comunidad == data.comunidad[i].comunidad){
                          //this.rows[jj][data.comunidad[i].tipo_observacion]= data.comunidad[i].resueltos;
                          this.rows[jj][data.comunidad[i].tipo_observacion]= data.comunidad[i].no_resuelto_leve
                                                                          + data.comunidad[i].no_resuelto_regular
                                                                          + data.comunidad[i].no_resuelto_grave;

                           pieTemp[0][1] = pieTemp[0][1] +  data.comunidad[i].no_resuelto_leve;
                           pieTemp[1][1] = pieTemp[1][1] + data.comunidad[i].no_resuelto_regular;
                           pieTemp[2][1] = pieTemp[2][1] +data.comunidad[i].no_resuelto_grave;

                          break;                          
                        }
                      }
                    }else{        

                      categoriesObservacionTipo.push(data.comunidad[i].comunidad);

                      observacionTipo[posCom-1].data.push(data.comunidad[i].resueltos);
                      
                      comunidades.push({
                        name:data.comunidad[i].comunidad,
                        series:[
                          {
                            name:data.comunidad[i].tipo_observacion,
                            value:data.comunidad[i].resueltos
                          }
                        ]
                      });
                      let row={
                        'comunidad':data.comunidad[i].comunidad
                      }
                      //row[data.comunidad[i].tipo_observacion] = data.comunidad[i].resueltos;
                      row[data.comunidad[i].tipo_observacion] = data.comunidad[i].no_resuelto_leve
                                                              + data.comunidad[i].no_resuelto_regular
                                                              + data.comunidad[i].no_resuelto_grave;
                      this.rows.push(row);
                       pieTemp[0][1] = pieTemp[0][1] + data.comunidad[i].no_resuelto_leve;
                       pieTemp[1][1] = pieTemp[1][1] + data.comunidad[i].no_resuelto_regular;
                       pieTemp[2][1] = pieTemp[2][1] + data.comunidad[i].no_resuelto_grave;
                    }
                  }


                  let totalPie = pieTemp[0][1] +  pieTemp[1][1]+  pieTemp[2][1];

                  let pie1:any[] =[
                    {name:data.grafico_1[0].existente,y:data.grafico_1[0].q},
                    {name:data.grafico_1[1].existente,y:data.grafico_1[1].q}
                  ];

                  let xTipo = [];
                  let posicionTipo = -1;
                  let posicionClasificacion = -1;
                  let dataGrafico2 = [ ];
                  for(let i =0;i < data.grafico_2.length;i++){
                    posicionTipo = -1;
                    for(let y=0;y < xTipo.length;y++){
                      if(data.grafico_2[i].tipo == xTipo[y]){
                        posicionTipo = y;
                        break;
                      }
                    }
                    if(posicionTipo < 0){
                      posicionTipo = xTipo.length;
                      xTipo.push(data.grafico_2[i].tipo);
                    }

                    posicionClasificacion = -1;
                    for(let y =0 ; y < dataGrafico2.length; y++){
                      if(data.grafico_2[i].clasificacion == dataGrafico2[y].name){
                        posicionClasificacion = y;
                        break;
                      }
                    }

                    if(posicionClasificacion < 0){
                      posicionClasificacion = dataGrafico2.length;
                      dataGrafico2.push({name:data.grafico_2[i].clasificacion,data:[]});
                    }

                    dataGrafico2[posicionClasificacion].data[posicionTipo] = parseFloat(data.grafico_2[i].q);
                  }

                  for(let i=0;i < dataGrafico2.length; i++){
                    for(let y=0;y < dataGrafico2[i].data.length;y++){
                      dataGrafico2[i].data[y] = dataGrafico2[i].data[y]?dataGrafico2[i].data[y]:0;
                    }
                  }

                  let xComunidad = [];
                  let posicionComunidad = -1;
                  let posicionTipo3 = -1;
                  let dataGrafico3 = [ ];

                  for(let i =0;i < data.grafico_3.length;i++){
                    posicionComunidad = -1;
                    for(let y=0;y < xComunidad.length;y++){
                      if(data.grafico_3[i].comunidad == xComunidad[y]){
                        posicionComunidad = y;
                        break;
                      }
                    }
                    if(posicionComunidad < 0){
                      posicionComunidad = xComunidad.length;
                      xComunidad.push(data.grafico_3[i].comunidad);
                    }

                    posicionTipo3 = -1;
                    for(let y =0 ; y < dataGrafico3.length; y++){
                      if(data.grafico_3[i].tipo+' - '+data.grafico_3[i].clasificacion == dataGrafico3[y].name){
                        posicionTipo3 = y;
                        break;
                      }
                    }

                    if(posicionTipo3 < 0){
                      posicionTipo3 = dataGrafico3.length;
                      dataGrafico3.push({name:data.grafico_3[i].tipo+' - '+data.grafico_3[i].clasificacion,data:[]});
                    }

                    dataGrafico3[posicionTipo3].data[posicionComunidad] = parseFloat(data.grafico_3[i].q);
                  }

                  for(let i=0;i < dataGrafico3.length; i++){
                    for(let y=0;y < dataGrafico3[i].data.length;y++){
                      dataGrafico3[i].data[y] = dataGrafico3[i].data[y]?dataGrafico3[i].data[y]:0;
                    }
                  }

                  this.chart1 = new Chart({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: 0,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: '<b>Nro. Acumulado de Observaciones</b>'
                    },
                    tooltip:{
                      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br/><b>{point.y}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            /*colors: [
                                   '#fcbba1', 
                                   '#fb6a4a', 
                                   '#a50f15'                                    
                                 ],*/
                            dataLabels: {
                                enabled: true,
                                distance: -10,
                                style: {
                                    fontWeight: 'bold',
                                    color: 'black'
                                }
                            }
                        }
                    },
                    series: [{
                      name: 'Observaciones',
                      data: [{
                          name: data.grafico_1[0].existente,
                          y: parseFloat(data.grafico_1[0].q),
                          sliced: true,
                          selected: true
                      }, {
                          name: data.grafico_1[1].existente,
                          y: parseFloat(data.grafico_1[1].q)
                      }]
                  }]
                  });


                  this.chart2   = new Chart({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '<b>Nro. de observaciones existentes</b>'
                    },
                    xAxis: {
                        categories: xTipo
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: ' '
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'y'
                        }
                    },
                    series: dataGrafico2
                });
                  this.chart3   = new Chart({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '<b>Observaciones existentes por comunidad</b>'
                    },
                    xAxis: {
                        categories: xComunidad
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: ' '
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },
                    series: dataGrafico3
                });
/*
                  this.chartPie = new Chart({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: '<b>Observaciones no resueltas</b>',
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 120
                    },
                    subtitle: {
                        text: "<b>"+totalPie+"</b>",
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 90
                    },/*
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">{series.name}: {point.y} <b>{point.percentage:.1f}%</b></span>'
                    },*/
                   /* tooltip:{
                      shared: true
                    },
                    plotOptions: {
                        pie: {
                        colors: [
                                   '#fcbba1', 
                                   '#fb6a4a', 
                                   '#a50f15'                                    
                                 ],
                            dataLabels: {
                                enabled: true,
                                distance: -10,
                                style: {
                                    fontWeight: 'bold',
                                    color: 'black'
                                }
                            },
                            startAngle: -90,
                            endAngle: 90,
                            center: ['50%', '75%']
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Observación',
                        innerSize: '50%',
                        data: pieTemp
                    }]
                  });
*/
                  this.chartObservacion = new Chart({
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Evolución de observaciones'
                    },
                    xAxis: [{
                        categories: categoriesObservacion,
                        crosshair: true
                    }],
                    yAxis: [
                      { // Primary yAxis
                        
                        title: {
                          text: 'Tiempo promedio resolución (meses)'
                        }
                      }, 
                      { // Secondary yAxis
                        title: {
                          text: 'Nro de Observaciones'
                        },
                        opposite: true
                      }
                    ],
                    plotOptions: {
                        column: {
                            stacking: 'normal',
							 dataLabels: {
                                enabled: true,                                
                            }
                        }
                    }, 
                            colors: [
                                   '#66bd63', 
                                   '#d73027',
                                   '#3288bd'                                   
                                 ],
                    tooltip:{
                      shared: true
                    },
                    series:observacion
                  });

                  this.chartObservacionNueva = new Chart({
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Observaciones nuevas'
                    },
                    xAxis: [{
                        categories: categoriesObservacionNueva,
                        crosshair: true
                    }],
                    yAxis: [
                      { 
                        title: {
                          text: 'Acumulado de Nro de observaciones'
                        }
                      }, 
                      { 
                        title: {
                          text: 'Nro nuevas observaciones '
                        },
                        opposite: true
                      }
                    ], 
                    tooltip:{
                      shared: true
                    },
                    series:observacionNueva
                  });

                  /*
                  this.chartObservacionTipo = new Chart({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: 'column'
                    },
                    colors: ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
                    title: {
                        text: 'Tipo de observaciones'
                    },
                    xAxis: {
                        categories: categoriesObservacionTipo
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Nro. de observaciones'
                        }
                     }   
                    
                    ,tooltip:{
                      shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',                            
                            dataLabels: {
                                enabled: true,                                
                            }
                        }
                    },
                    series:observacionTipo
                  });
                  */
                }
                
                $(window).trigger('resize');
                this.formLoading = false;

              },error=>{
                  this.showMessage('error', 'Vuelva a intentar en unos minutos', '');
                  this.formLoading = false;
              }
          );
        }
        
    }

    onSelectCategoria(event){
      if(event!=null){
        if(event.value=='AMBIENTAL'){
          this.comunidades = this.ambiental_comunidad;
          this.tipo_observacion = this.ambiental_tipo_observacion;
        }else{
          this.comunidades = this.geotecnico_comunidad;
          this.tipo_observacion = this.geotecnico_tipo_observacion;
        }
      }else{
        this.comunidades = [];
        this.tipo_observacion = [];
        this.formBuscar.controls['comunidad'].setValue([]);
        this.formBuscar.controls['tipo_observacion'].setValue([]);
      }

    }


  onSelect(event) {
    //console.log(event);
  }

    showMessage(type,title,message){
        if(this.toasActive!=null){
            this.toasterService.clear(this.toasActive.toastId, this.toasActive.toastContainerId);
            this.toasActive = this.toasterService.pop(type, title, message);
        }else{
            this.toasActive = this.toasterService.pop(type, title, message);            
        }

    }

}