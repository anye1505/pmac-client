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
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Chart } from 'angular-highcharts';



//import { SankeyChart } from 'angular-highcharts';

@Component({
    selector: 'indicador-acceso',
    templateUrl: './indicador-acceso.component.html',
    styleUrls: ['./indicador-acceso.component.scss']

})
export class IndicadorAccesoComponent  implements OnInit  {
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


  public chartVisitas_institucion: Chart;
  public chartVisitas_personas: Chart;
  public chartSalida_comuneros: Chart;
  public chartRegreso_comuneros:Chart;
  
constructor(
        public settings: SettingsService,
        fb: FormBuilder,
        private router: Router,
        public toasterService: ToasterService,
        public _indicadorService:IndicadorService

        
     ) {

        this.formLoading = false;

        let anioActual = new Date().getUTCFullYear();

        for(let i =anioActual  ;i >=2016 ; i--){
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

          this._indicadorService.controlAcceso(
              param,
              data=>{
                if(data.error){
                  this.showMessage('error',data.mensaje,'');
                }else{ 
                  this.formLoading=false;  
                  let pos_visita_institucion = -1;
                  let pos_visita_institucion_2 = -1;
                  let visitas_instituciones = [];
                  let data_visitas_instituciones = [];

                  for(let i=0; i < data.visitas_institucion.length; i++){
                    pos_visita_institucion = -1;
                    pos_visita_institucion_2 = -1;

                    for(let j=0; j < visitas_instituciones.length; j++){
                      if(visitas_instituciones[j] == data.visitas_institucion[i].comunidad){
                        pos_visita_institucion = j;
                        break;
                      }
                    }

                    for(let j=0; j < data_visitas_instituciones.length;j++){
                      if(data_visitas_instituciones[j].name == data.visitas_institucion[i].institucion){
                        pos_visita_institucion_2 = j;
                        break;
                      }
                    }

                    if(pos_visita_institucion >= 0){

                    }else{
                      pos_visita_institucion = visitas_instituciones.length;
                      visitas_instituciones.push(data.visitas_institucion[i].comunidad);
                    }

                    if(pos_visita_institucion_2 >= 0){
                      
                    }else{
                      pos_visita_institucion_2 = data_visitas_instituciones.length;
                      data_visitas_instituciones.push({
                        name : data.visitas_institucion[i].institucion,
                        data : []
                      });
                    }
                    data_visitas_instituciones[pos_visita_institucion_2].data[pos_visita_institucion] = parseInt(data.visitas_institucion[i].nro_visitas);

                  }
                  
                  for(let jj = 0; jj < data_visitas_instituciones.length; jj++){
                    for(let zz=0; zz < visitas_instituciones.length; zz++){
                      if(!data_visitas_instituciones[jj].data[zz]){
                        data_visitas_instituciones[jj].data[zz] = 0;                        
                      }
                    }

                  }





                  let visitas_personas = [];
                  let data_visitas_presonas = [
                    {
                      name:'Colonos',
                      data:[]
                    },
                    {
                      name:'Nativos',
                      data:[]
                    }
                  ];


                  for(let i=0; i < data.visitas_personas.length; i++){
                      visitas_personas.push(data.visitas_personas[i].com_nombre);
                      data_visitas_presonas[0].data.push(parseInt(data.visitas_personas[i].colonos));
                      data_visitas_presonas[1].data.push(parseInt(data.visitas_personas[i].nativos));
                  }

                  let data_salida_comuneros:any[] = [];

                  for(let i=0; i < data.salida_comuneros.length; i++){
                      data_salida_comuneros.push(
                        [
                         data.salida_comuneros[i].desde,
                          data.salida_comuneros[i].hasta,
                          parseInt(data.salida_comuneros[i].nro_comuneros)
                        
                        ]
                      );
                  }

                  let data_regreso_comuneros = [];

                  for(let i=0; i < data.regreso_comuneros.length; i++){
                      data_regreso_comuneros.push(
                        [
                          data.regreso_comuneros[i].desde,
                          data.regreso_comuneros[i].hasta,
                          parseInt(data.regreso_comuneros[i].nro_comuneros)
                        ]
                      );
                  }

                  this.chartVisitas_institucion = new Chart({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '<b>Visitas de Instituciones</b>'
                    },
                    xAxis: {
                        categories: visitas_instituciones
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Visitas'
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                //color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true,
                                //color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: data_visitas_instituciones
                  });

                  this.chartVisitas_personas = new Chart({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '<b>Visitas de Personas</b>'
                    },
                    xAxis: {
                        categories: visitas_personas
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Número de visitas'
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                //color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true,
                                //color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: data_visitas_presonas
                  });

                  let keys:any[]=['from', 'to', 'weight'];
                  this.chartSalida_comuneros = new Chart({
                      credits: {
                          enabled: false
                      },

                      title: {
                          text: 'Movilización de comuneros - Salidas'
                      },

                      plotOptions: {
                        series:{
                          keys:keys
                        },
                      },
                      series: [{
                          //keys: keys,//['from', 'to', 'weight'],
                          data: data_salida_comuneros,
                          type: 'sankey',
                          name: 'Salida'
                      }]

                  });
                  this.chartRegreso_comuneros = new Chart({
                      credits: {
                          enabled: false
                      },

                      title: {
                          text: 'Movilización de comuneros - Regreso'
                      },
                      plotOptions: {
                        series:{
                          keys:keys
                        },
                      },
                      series: [{
                          //keys: ['from', 'to', 'weight'],
                          data: data_regreso_comuneros,
                          type: 'sankey',
                          name: 'Salida'
                      }]

                  });
                }
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
      //console.log(event)

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