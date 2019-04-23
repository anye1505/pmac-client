import { Component, OnInit,ViewChild } from '@angular/core';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Chart } from 'angular-highcharts';
@Component({
    selector: 'indicador-gestion',
    templateUrl: './indicador-gestion.component.html',
    styleUrls: ['./indicador-gestion.component.scss']
})
export class IndicadorGestionComponent implements OnInit{
     public anios:any[] = [];

    public meses:any[] = [
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

    public formLoading:boolean;
    /*Form*/
    public formBuscar: FormGroup;
    public categorias  =  [];
    public comunidades  =  [];
    public tipos  =  [];


    public toasActive;
    public toaster: any;
    public toasterConfig: any;
    public toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });


    public chartViviendas: Chart;    
    public chartInstalacion: Chart;  
    public chartComercios: Chart;  
    public chartComerciosCrecimiento: Chart;  
    public chartFaenas: Chart;  
    public chartBuble: Chart;
    public chartChacras:Chart;
    public chartAnimales:Chart;
	public chartBublePesca: Chart;
	public chartPesca:Chart;
	public chartPeces:Chart;

    constructor(
        public settings: SettingsService,
        fb: FormBuilder,
        private router: Router,
        public toasterService: ToasterService,
        public _indicadorService:IndicadorService
        
     ) {
        this.formLoading = false;

        let anioActual = new Date().getUTCFullYear();

        for(let i = anioActual;i >= 2016; i--){
          this.anios.push({name:i,value:i});
        }
        this.formBuscar = fb.group({
            'desde_anio': [anioActual, Validators.compose([Validators.required])],
            'desde_mes': ['01', Validators.compose([Validators.required])],
            'hasta_anio': [anioActual, Validators.compose([Validators.required])],
            'hasta_mes': ['12', Validators.compose([Validators.required])]
        });
    }
    ngOnInit() {
    }
    submitFormAmbiental($ev, value: any) {
      
        $ev.preventDefault();
        for (let c in this.formBuscar.controls) {
            this.formBuscar.controls[c].markAsTouched();
        }
        if (this.formBuscar.valid) {     
          this.formLoading=true;  
          
          let param={
            desde:value.desde_anio+""+value.desde_mes,
            hasta:value.hasta_anio+""+value.hasta_mes
          }

          this._indicadorService.gestionSocial(
              param,
              data=>{
                if(data.error){
                  this.showMessage('error',data.mensaje,'');
                }else{ 
                  if(data.data.length < 1){
                    this.showMessage('warning', 'No se encontraron datos.', '');
                  }else{
                    let categories = [];
                    let series = [{
                      name:'Vivienda Nueva',
                      data:[]
                    },{
                      name:'Vivienda Mejorada',
                      data:[]
                    },{
                      name:'Vivienda Abandonada',
                      data:[]
                    }];


                    let seriesInstalacion = [{
                      name:'Inst. Agua',
                      data:[]
                    },{
                      name:'Inst. Luz',
                      data:[]
                    },{
                      name:'Inst. TV - Cable',
                      data:[]
                    }];

                    let seriesComercios = [{
                      name:'Bodega',
                      data:[]
                    },{
                      name:'Bar',
                      data:[]
                    },{
                      name:'Restaurante',
                      data:[]
                    },{
                      name:'Otro',
                      data:[]
                    }];

                    let seriesComerciosCrecimiento = [{
                      name:'Bodega',
                      data:[]
                    },{
                      name:'Bar',
                      data:[]
                    },{
                      name:'Restaurante',
                      data:[]
                    },{
                      name:'Otro',
                      data:[]
                    }];

                    let seriesFaenas = [{
                      type: 'column',
                      name:'Promedio de participantes Mujeres',
                      data:[]
                    },{
                      name:'Promedio de participantes varones',
                      type: 'column',
                      data:[]
                    },{
                      type: 'scatter',
                      name:'Nro de faenas',
                      data:[],
                      marker: {
                          radius: 12
                      },
                      yAxis: 1
                    }];

                    for(let i = 0; i < data.data.length; i++){
                      categories.push(data.data[i].com_nombre);
                      series[0].data.push(parseInt(data.data[i].sca_vivienda_nueva));
                      series[1].data.push(parseInt(data.data[i].sca_vivienda_mejorada));
                      series[2].data.push(parseInt(data.data[i].sca_vivienda_abandonada) );

                      seriesInstalacion[0].data.push(parseInt(data.data[i].sca_instalacion_nueva_agua));
                      seriesInstalacion[1].data.push(parseInt(data.data[i].sca_instalacion_nueva_luz));
                      seriesInstalacion[2].data.push(parseInt(data.data[i].sca_instalacion_nueva_tvcable));

                      seriesComercios[0].data.push(parseInt(data.data[i].sca_negocio_nuevo_bodega));
                      seriesComercios[1].data.push(parseInt(data.data[i].sca_negocio_nuevo_bar));
                      seriesComercios[2].data.push(parseInt(data.data[i].sca_negocio_nuevo_restaurante));
                      seriesComercios[3].data.push(parseInt(data.data[i].sca_negocio_nuevo_otro));

                      seriesComerciosCrecimiento[0].data.push(parseInt(data.data[i].sca_negocio_crecio_bodega));
                      seriesComerciosCrecimiento[1].data.push(parseInt(data.data[i].sca_negocio_crecio_bar));
                      seriesComerciosCrecimiento[2].data.push(parseInt(data.data[i].sca_negocio_crecio_restaurante));
                      seriesComerciosCrecimiento[3].data.push(parseInt(data.data[i].sca_negocio_crecio_otro));


                      seriesFaenas[0].data.push(parseInt(data.data[i].sca_faena_participante_mujer));
                      seriesFaenas[1].data.push(parseInt(data.data[i].sca_faena_participante_varon));
                      seriesFaenas[2].data.push(parseInt(data.data[i].sca_faena_numero));

                    }

                    this.chartViviendas = new Chart({
                      chart: {
                              type: 'column'
                          },
                          title: {
                              text: 'Cambios en viviendas'
                          },
                          xAxis: {
                              categories: categories
                          },
                           yAxis: {
                              title: {
                              text: 'Nro de cambios en viviendas'
                             }
                          },
                          plotOptions: {
                              column: {
                                  stacking: 'normal',
                                  dataLabels: {
                                      enabled: true
                                  }
                              }
                          },
                          credits: {
                              enabled: false
                          },
                          series: series
                      });


                    this.chartInstalacion = new Chart({
                      chart: {
                              type: 'column'
                          },
                          title: {
                              text: 'Instalación de nuevos servicios'
                          },
                          xAxis: {
                              categories: categories
                          },
                           yAxis: {
                              title: {
                              text: 'Nro de nuevos servicios'
                             }
                          },
                          plotOptions: {
                              column: {
                                  stacking: 'normal',
                                  dataLabels: {
                                      enabled: true
                                  }
                              }
                          },
                          credits: {
                              enabled: false
                          },
                          series: seriesInstalacion
                      });

                    this.chartComercios = new Chart({
                      chart: {
                              type: 'column'
                          },
                          title: {
                              text: 'Nuevos comercios'
                          },
                          xAxis: {
                              categories: categories
                          },yAxis: {
                              title: {
                              text: 'Nro de nuevos comercios'
                             }
                          },
                          plotOptions: {
                              column: {
                                  stacking: 'normal',
                                  dataLabels: {
                                      enabled: true
                                  }
                              }
                          },
                          credits: {
                              enabled: false
                          },
                          series: seriesComercios
                      });

                    this.chartComerciosCrecimiento = new Chart({
                      chart: {
                              type: 'column'
                          },
                          title: {
                              text: 'Crecimiento de comercios'
                          },
                          xAxis: {
                              categories: categories
                          },yAxis: {
                              title: {
                              text: 'Nro de comercios'
                             }
                          },
                          plotOptions: {
                              column: {
                                  stacking: 'normal',
                                  dataLabels: {
                                      enabled: true
                                  }
                              }
                          },
                          credits: {
                              enabled: false
                          },
                          series: seriesComerciosCrecimiento
                      });

                    this.chartFaenas = new Chart({
                      chart: {
                             // type: 'column'
                          },
                          title: {
                              text: 'Faenas comunales'
                          },
                          xAxis: {
                              categories: categories,
                              crosshair: true
                             
                          },
                          yAxis: [{ // Primary yAxis
                              labels: {                                  
                                  style: {
                                      //color: Highcharts.getOptions().colors[1]
                                  }
                              },
                              title: {
                                  text: 'Nro de participantes'
                              }
                          }, { // Secondary yAxis
                              title: {
                                  text: 'Nro de faenas'
                              },
                              labels: {
                                //  format: '{value} mm',
                                  style: {
                                      //color: Highcharts.getOptions().colors[0]
                                  }
                              },
                              opposite: true
                          }],

                          plotOptions: {
                              column: {
                                  stacking: 'normal',
                                  dataLabels: {
                                      enabled: true
                                  }
                              },
                               scatter: {
                                    tooltip: {
                                        //crosshairs: true,
                                        headerFormat: '<b>{point.x}</b>',
                                        pointFormat: '<br />Nro. Faenas: <b>{point.y}</b>'
                                    },
                                     dataLabels: {
                                        enabled: true,
                                        format: '{point.y}',
                                        //rotation: -90,
                                        color: '#FFFFFF',
                                        align: 'center',
                                        //format: '{point.y:.1f}', // one decimal
                                        y: 13, // 10 pixels down from the top
                                        style: {
                                            fontSize: '11px',
                                            fontFamily: 'Verdana, sans-serif'
                                        }

                                    }
                                }

                          },
                          credits: {
                              enabled: false
                          },
                          series: seriesFaenas
                      });

                    let seriesBuble:any[] = [];
					let promedio_menciones: number=0.000;
					let promedio_faenas: number=0.000;
					let total_menciones: number=0;
					let total_faenas: number=0;
                    for(let i=0;i<data.data2.length;i++){
                      seriesBuble.push({
                        x:parseInt(data.data2[i].x),
                        y:parseInt(data.data2[i].y),
                        z:parseFloat(data.data2[i].z),
                        name:data.data2[i].nombre,
                        country:data.data2[i].comunidad
                      });
					  total_menciones=total_menciones+data.data2[i].y;
					  total_faenas= total_faenas + data.data2[i].x;
                    }
					promedio_menciones= total_menciones/data.data2.length;
					promedio_faenas=total_faenas/data.data2.length;
                    this.chartBuble = new Chart({
                         chart: {
                              type: 'bubble',
                              plotBorderWidth: 1,
                              zoomType: 'xy'
                          },

                          legend: {
                              enabled: false
                          },

                          title: {
                              text: 'Actividades de caza'
                          },
                          credits:{
                            enabled:false
                          },
                          xAxis: {
                              gridLineWidth: 1,
                              title: {
                                  text: 'Nro. de faenas de caza registradas'
                              },
                              labels: {
                                  format: '{value}'
                              },
                              plotLines: [{
                                  color: 'black',
                                  dashStyle: 'dot',
                                  width: 2,
                                  value: promedio_faenas,
                                  label: {
                                      rotation: 0,
                                      y: 15,                                    
                                      text: promedio_faenas+''
                                  },
                                  zIndex: 3
                              }]
                          },
                          yAxis: {
                              startOnTick: false,
                              endOnTick: false,
                              title: {
                                  text: 'Nro de menciones de animales cazados'
                              },
                              labels: {
                                  format: '{value}'
                              },
                              maxPadding: 0.2,
                              plotLines: [{
                                  color: 'black',
                                  dashStyle: 'dot',
                                  width: 2,
                                  value: promedio_menciones,
                                  label: {
                                      align: 'right',
                                      text: promedio_menciones+'',
                                      x: -10
                                  },
                                  zIndex: 3
                              }]
                          },

                          tooltip: {
                              useHTML: true,
                              headerFormat: '<table>',
                              pointFormat: '<tr><th colspan="2"><b>{point.country}</b></th></tr>' +
                                  '<tr><td>Nro. faenas de caza:</td><th>{point.x}</th></tr>' +
                                  '<tr><td>Nro. menciones animales:</td><th>{point.y}</th></tr>' +
                                  '<tr><td>% destinado a consumo:</td><th>{point.z}%</th></tr>',
                              footerFormat: '</table>',
                              followPointer: true
                          },

                          plotOptions: {
                              series: {
                                  dataLabels: {
                                      enabled: true,
                                      format: '{point.name}'
                                  }
                              }
                          },
                           series: [{
                              data: seriesBuble
                          }]
                    });

                    let categoriesChacras = [];
                    let seriesChacras =[{
                            name: 'Chacra: promedio de Nro. salidas',
                            color: 'rgba(165,170,217,1)',
                            data: [],
                            pointPadding: 0.3,
                           pointPlacement: -0.2
                        }, {
                            name: 'Chacra: promedio horas por salida',
                            color: 'rgba(126,86,134,.9)',
                            data: [],
                            pointPadding: 0.4,
                            pointPlacement: -0.2
                        }, {
                            name: 'Bosque: promedio de Nro. de salidas',
                            color: 'rgba(248,161,63,1)',
                            data: [],                          
                            pointPadding: 0.3,
                            pointPlacement: 0.2,
                            yAxis: 1
                        }, {
                            name: 'Bosque: promedio horas por salida',
                            color: 'rgba(186,60,61,.9)',
                            data: [],                           
                            pointPadding: 0.4,
                            pointPlacement: 0.2,
                            yAxis: 1
                        }];

                      for(let i=0; i< data.data3.length;i++){
                        categoriesChacras.push(data.data3[i].comunidad);
                        seriesChacras[0].data.push(parseInt(data.data3[i].chacra_salidas));
                        seriesChacras[1].data.push(parseInt(data.data3[i].chacra_horas));
                        seriesChacras[2].data.push(parseInt(data.data3[i].bosque_salidas));
                        seriesChacras[3].data.push(parseInt(data.data3[i].bosque_horas));

                      }
                      this.chartChacras = new Chart({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Tiempo destinado de caza'
                        },
                        xAxis: {
                            categories: categoriesChacras
                        },
                        yAxis: [{
                            min: 0,
                            title: {
                                text: 'Chacra: Nro de salidas'
                            }
                        }, {
                            title: {
                                text: 'Bosque: Nro de salidas'
                            },
                            opposite: true
                        }],
                        legend: {
                            shadow: false
                        },
                        tooltip: {
                            shared: true
                        },
                        plotOptions: {
                            column: {
                                grouping: false,
                                shadow: false,
                                borderWidth: 0
                            }
                        },credits: {
                              enabled: false
                          },
                        series: seriesChacras
                    });
                      
                    let categoriesAnimales = [];
                      let seriesAnimales =[{
                          name: 'Chacra',
                          data: []
                      }, {
                          name: 'Bosque',
                          data: []
                      }]
                      for(let i=0; i< data.data4.length;i++){
                        categoriesAnimales.push(data.data4[i].animal);
                        seriesAnimales[0].data.push(parseInt(data.data4[i].chacra));
                        seriesAnimales[1].data.push(parseInt(data.data4[i].bosque));

                      }
                    this.chartAnimales = new Chart({
                      chart: {
                          type: 'bar'
                      },
                      title: {
                          text: 'Animales cazados'
                      },
                      xAxis: [{
                          categories: categoriesAnimales,
                          reversed: false,
                          labels: {
                              step: 1
                          }
                      }, { // mirror axis on right side
                          opposite: true,
                          reversed: false,
                          categories: categoriesAnimales,
                          linkedTo: 0,
                          labels: {
                              step: 1
                          }
                      }],
                      yAxis: {
                          title: {
                              text: 'Nro de menciones de animales cazados'
                          },
                          labels: {
                              formatter: function () {
                                  return Math.abs(this.value)+'' ;
                              }
                          }
                      },

                      plotOptions: {
                          series: {
                              stacking: 'normal'
                          }
                      },
                      credits: {
                              enabled: false
                          },
                      series: seriesAnimales
                    });


                    


///Pesca

                    let seriesBublePesca:any[] = [];
					let total_kg_pescado: number=0;
					let total_faenas_pesca: number=0;
					let promedio_kg_pescado: number=0.00;
					let promedio_faenas_pesca: number=0.00;
					
                    for(let i=0;i<data.data5.length;i++){
                      seriesBublePesca.push({
                        x:parseInt(data.data5[i].x),
                        y:parseInt(data.data5[i].y),
                        z:parseFloat(data.data5[i].z),
                        name:data.data5[i].nombre,
                        country:data.data5[i].comunidad
                      });
					  total_kg_pescado= total_kg_pescado + data.data5[i].y ;
					  total_faenas_pesca= total_faenas_pesca + data.data5[i].x ;
                    }
					promedio_faenas_pesca= total_faenas_pesca/data.data5.length ;
					promedio_kg_pescado = total_kg_pescado/data.data5.length ;
                    this.chartBublePesca = new Chart({
                         chart: {
                              type: 'bubble',
                              plotBorderWidth: 1,
                              zoomType: 'xy'
                          },
                          legend: {
                              enabled: false
                          },
                          title: {
                              text: 'Actividad de Pesca'
                          },
                          credits:{
                            enabled:false
                          },
                          xAxis: {
                              gridLineWidth: 1,
                              title: {
                                  text: 'Nro. de faenas de pesca registradas'
                              },
                              labels: {
                                  format: '{value}'
                              },
                              plotLines: [{
                                  color: 'black',
                                  dashStyle: 'dot',
                                  width: 2,
                                  value: promedio_faenas_pesca,
                                  label: {
                                      rotation: 0,
                                      y: 15,
                                      text: promedio_faenas_pesca+''
                                  },
                                  zIndex: 3
                              }]
                          },
                          colors:["#33a02c","#1f78b4","#fb9a99"],

                          yAxis: {
                              startOnTick: false,
                              endOnTick: false,
                              title: {
                                  text: 'Kg pescado'
                              },
                              labels: {
                                  format: '{value}'
                              },
                              maxPadding: 0.2,
                              plotLines: [{
                                  color: 'black',
                                  dashStyle: 'dot',
                                  width: 2,
                                  value: promedio_kg_pescado,
                                  label: {
                                      align: 'right',
                                      style: {
                                          //fontStyle: 'italic'
                                      },
                                      text: promedio_kg_pescado+'',
                                      x: -10
                                  },
                                  zIndex: 3
                              }]
                          },

                          tooltip: {
                              useHTML: true,
                              headerFormat: '<table>',
                              pointFormat: '<tr><th colspan="2"><b>{point.country}</b></th></tr>' +
                                  '<tr><td>Nro. faenas de pesca:</td><th>{point.x}</th></tr>' +
                                  '<tr><td>kg pescado:</td><th>{point.y}</th></tr>' +
                                  '<tr><td>% destinado a consumo:</td><th>{point.z}%</th></tr>',
                              footerFormat: '</table>',
                              followPointer: true
                          },

                          plotOptions: {
                              series: {
                                  dataLabels: {
                                      enabled: true,
                                      format: '{point.name}'
                                  }
                              }
                          },
                           series: [{
                              data: seriesBublePesca
                          }]
                    });


                    let categoriasPesca = [];
                    let seriesPesca =[{
                            name: 'Río: Nro de salidas',
                            color: 'rgba(118,42,131,1)',
                            data: [],
                            pointPadding: 0.3,
                           pointPlacement: -0.2
                        }, {
                            name: 'Río: Horas promedio de pesca',
                            color: 'rgba(175,141,195,.9)',
                            data: [],
                            pointPadding: 0.4,
                            pointPlacement: -0.2
                        }, {
                            name: 'Quebrada: Nro de salidas',
                            color: 'rgba(27,120,55,1)',
                            data: [],                           
                            pointPadding: 0.3,
                            pointPlacement: 0.2,
                            yAxis: 1
                        }, {
                            name: 'Quebrada: Horas promedio de pesca',
                            color: 'rgba(127,191,123,.9)',
                            data: [],                            
                            pointPadding: 0.4,
                            pointPlacement: 0.2,
                            yAxis: 1
                        }];

                      for(let i=0; i< data.data3.length;i++){
                        categoriasPesca.push(data.data6[i].comunidad);
                        seriesPesca[0].data.push(parseInt(data.data6[i].rio_salidas));
                        seriesPesca[1].data.push(parseInt(data.data6[i].rio_horas));
                        seriesPesca[2].data.push(parseInt(data.data6[i].quebrada_salidas));
                        seriesPesca[3].data.push(parseInt(data.data6[i].quebrada_horas));

                      }
                      this.chartPesca = new Chart({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Tiempo destinado a la pesca'
                        },
                        xAxis: {
                            categories: categoriasPesca
                        },
                        yAxis: [{
                            min: 0,
                            title: {
                                text: 'Río: promedio de Nro. de salidas'
                            }
                        }, {
                            title: {
                                text: 'Quebrada: promedio de Nro. de salidas'
                            },
                            opposite: true
                        }],
                        legend: {
                            shadow: false
                        },
                        tooltip: {
                            shared: true
                        },
                        plotOptions: {
                            column: {
                                grouping: false,
                                shadow: false,
                                borderWidth: 0
                            }
                        },credits: {
                              enabled: false
                          },
                        series: seriesPesca
                    });



                     let categoriasPeces = [];
                      let seriesPeces =[{
                          name: 'Río',
                          data: []
                      }, {
                          name: 'Quebrada',
                          data: []
                      }]
                      for(let i=0; i< data.data7.length;i++){
                        categoriasPeces.push(data.data7[i].pez);
                        seriesPeces[0].data.push(parseInt(data.data7[i].rio));
                        seriesPeces[1].data.push(parseInt(data.data7[i].quebrada));

                      }
                    this.chartPeces = new Chart({
                      chart: {
                          type: 'bar'
                      },
                      colors:["#fdb462","#80b1d3"],
                      title: {
                          text: 'Peces'
                      },
                      xAxis: [{
                          categories: categoriasPeces,
                          reversed: false,
                          labels: {
                              step: 1
                          }
                      }, {
                          opposite: true,
                          reversed: false,
                          categories: categoriasPeces,
                          linkedTo: 0,
                          labels: {
                              step: 1
                          }
                      }],
                      yAxis: {
                          title: {
                              text: "Nro de menciones"
                          },
                          labels: {
                              formatter: function () {
                                  return Math.abs(this.value)+'' ;
                              }
                          }
                      },

                      plotOptions: {
                          series: {
                              stacking: 'normal'
                          }
                      },
                      credits: {
                              enabled: false
                          },
                      series: seriesPeces
                    });

///Pesca

                  }
                }
                this.formLoading = false;
              },error=>{
                  this.showMessage('error', 'Vuelva a intentar en unos minutos', '');
                  this.formLoading = false;
              }
          );
        }
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