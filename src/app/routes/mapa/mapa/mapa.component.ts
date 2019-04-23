import { Component, OnInit,ViewChild } from '@angular/core';
import { Router }      from '@angular/router';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { MapaService } from '../../../services/mapa.service';

import { GLOBAL } from '../../../global';

import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import * as $ from 'jquery';

import Map from 'ol/map';
import Overlay from 'ol/overlay';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import TileWMS from 'ol/source/tilewms';
import ImageWMS from 'ol/source/imagewms';
import Image from 'ol/source/image';
import osm from 'ol/source/osm';
import sourceVector from 'ol/source/vector';
import layerVector from 'ol/layer/vector';
import GeoJSON from 'ol/format/geojson';
import Style from 'ol/style/style';
import Icon from 'ol/style/icon';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Text from 'ol/style/text';
import Circle from 'ol/style/circle';
import geomCircle from 'ol/geom/circle';
import transform from 'ol/proj/transforms';
import point from 'ol/geom/point';
import interactionSelect from 'ol/interaction/select';
//import ol from 'ol';

import Feature from 'ol/feature';
import Heatmap from 'ol/layer/heatmap';
import Cluster from 'ol/source/cluster';
import TileImage from 'ol/source/tileimage';
import ImageLayer from 'ol/layer/image';
//import ImageBINGLayer from 'ol/source/bingmaps';

import { TabsetComponent } from 'ngx-bootstrap';
import { BsModalService,ModalDirective } from 'ngx-bootstrap/modal';

//import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';

@Component({
    selector: 'mapa-mapa',
    templateUrl: './mapa.component.html',
    styleUrls: ['./mapa.component.scss']

})
export class MapaComponent implements OnInit{
  public tablaGeotecnicas:any = [];
  public tablaAmbientales:any = [];
  public showTable:any;
  public cmbTipoGeotecnico;
  public cmbTipoAmbiental;
  public show:boolean = false;
  
    public identity;
    //public token;
    public formLoading:boolean;

    public formBuscarAmbiental: FormGroup;
    public formBuscarGeotecnico: FormGroup;

    public toasActive;
    toaster: any;
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });

    public ambiental_comunidades:any = [];
    public ambiental_observaciones:any = [];
    public ambiental_existentes:any = [];
    public ambiental_clasificaciones:any = [];

    public geotecnico_comunidades:any = [];
    public geotecnico_observaciones:any = [];
    public geotecnico_existentes:any = [];
    public geotecnico_clasificaciones:any = [];

    public  geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857'
          }
        },
        'features': []
    };

      public vectorLayer;
      public vectorLayerGeotecnico;
      public vectorSource;
      public vectorSourceGeotecnico;
      public vectorSourceIncidente;
      public vectorSourceCapacitacion;

      public vectorLayerHeatMap ;
      public vectorLayerGeotecnicoHeatMap ;
      public  vectorLayerCluster;
      public vectorLayerGeotecnicoCluster;
      public vectorLayerIncidente;
      public vectorLayerCapacitacion;

      public container ;
      public content ;
      public closer ;

      public chkLayerAmbiental = false;
      public chkLayerGeotecnico = false;

      public  overlay;

      public layerDistrito;
      public layerComunidad;
      public layerDuctos;
      public layerPoste;
      public layerDerechoVia;
      public layerGoogleImage;
      public layerBINGImage;
      public layerIncidente;

    public selectSingleClick = new interactionSelect();


    public limit=10;
    public rows = [];
    public selected = [];
    public selected2 = [];
    public rows2 = [];

    public map:any;

    public  slides:any = [
  ];


    public styleFunction = function(feature){

      //var styleFunction = function(feature) {
        let src ='assets/img/icon/'+feature.get('tipo_icono')+'.gif';
        return   new Style({
              image: new Icon( ({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.95,
                src: src//'assets/img/icon/f1_11.gif'
              })),
              stroke: new Stroke({
                width: 3,
                color: [255, 0, 0, 1]
              }),
              fill: new Fill({
                color: [0, 0, 255, 0.6]
              })
            });
        /*new Style({
          image: new Circle({
            radius: 5,
            snapToPixel: true,
            fill: new Fill({color: 'yellow'}),
            stroke: new Stroke({color: 'red', width: 1})
          })
        });*/

        /*, style:  new Style({
        image: new Circle({
          radius: 5,
          snapToPixel: true,
          fill: new Fill({color: 'yellow'}),
          stroke: new Stroke({color: 'red', width: 1})
        })
      })*/

      /* , style:  new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new Stroke({
          color: '#319FD3',
          width: 1
        }),
        text: new Text()
      })*//*
        ,*/

      //};
    }


    public styleFunctionGeotecnico = function(feature){
      //var styleFunction = function(feature) {
        let src ='assets/img/icon/'+feature.get('tipo_icono')+'.gif';
        return   new Style({
              image: new Icon( ({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.95,
                src: src//'assets/img/icon/f1_1.gif'
              })),
              stroke: new Stroke({
                width: 3,
                color: [255, 0, 0, 1]
              }),
              fill: new Fill({
                color: [0, 0, 255, 0.6]
              })
            });
    }

    public styleFunctionIncidente = function(feature){
      //var styleFunction = function(feature) {
        let src ='assets/img/icon/img_incidente.png';
        return   new Style({
              image: new Icon( ({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.95,
                src: src//'assets/img/icon/f1_1.gif'
              })),
              stroke: new Stroke({
                width: 3,
                color: [255, 0, 0, 1]
              }),
              fill: new Fill({
                color: [0, 0, 255, 0.6]
              })
            });
    }

       public styleFunctionCapacitacion = function(feature){
      //var styleFunction = function(feature) {
        let src ='assets/img/icon/img_capacitacion.png';
        return   new Style({
              image: new Icon( ({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.95,
                src: src
              })),
              stroke: new Stroke({
                width: 3,
                color: [255, 0, 0, 1]
              }),
              fill: new Fill({
                color: [0, 0, 255, 0.6]
              })
            });
    }

    @ViewChild('modalAmbiental') modalAmbiental: ModalDirective;
    @ViewChild('modalGeotecnico') modalGeotecnico: ModalDirective;
    @ViewChild('modalImagenes') modalImagenes: ModalDirective;

    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    constructor(
        public settings: SettingsService,
        fb: FormBuilder,
        private router: Router,
        public toasterService: ToasterService,
        public _mapaService:MapaService
        
     ) {
        this.showTable=true;

        this.formLoading = false;
        this.formBuscarAmbiental = fb.group({
            'comunidad': ['', Validators.compose([])],
            'observacion': [[], Validators.compose([])],
            'existente': ['', Validators.compose([])],
            'clasificacion': ['', Validators.compose([])],
            'desde': ['', Validators.compose([CustomValidators.date])],
            'hasta': ['', Validators.compose([CustomValidators.date])],
            'descripcion': ['', Validators.compose([])]
        });


        this.formBuscarGeotecnico = fb.group({
            'comunidad': ['', Validators.compose([])],
            'observacion': [[], Validators.compose([])],
            'existente': ['', Validators.compose([])],
            'clasificacion': ['', Validators.compose([])],
            'desde': ['', Validators.compose([CustomValidators.date])],
            'hasta': ['', Validators.compose([CustomValidators.date])],
            'descripcion': ['', Validators.compose([])]
        });
      
        this.formLoading = true;
        this._mapaService.param(
            {},
            data=>{
              if(data.error){
                  this.showMessage('error', data.mensaje, '');
              }else{

                this.ambiental_comunidades  =  data.datos.ambiental_comunidad;
                this.ambiental_observaciones  =  data.datos.ambiental_tipo_observacion;
                this.ambiental_existentes  =  data.datos.ambiental_existente;
                this.ambiental_clasificaciones  =  data.datos.ambiental_clasificacion;


                this.geotecnico_comunidades  =  data.datos.geotecnico_comunidad;
                this.geotecnico_observaciones  =  data.datos.geotecnico_tipo_observacion;
                this.geotecnico_existentes  =  data.datos.geotecnico_existente;
                this.geotecnico_clasificaciones  =  data.datos.geotecnico_clasificacion;
              }
              this.formLoading = false;
            },error=>{
              this.showMessage('error', 'Vuelva a intentar en unos minutos', '');
              this.formLoading = false;
            }
        )     
       
    }
    
    visualizarPanel() {
          this.show = !this.show;           
    }

    ngOnInit() {

         let parent=this;

        this.container = document.getElementById('popup');
        this.content = document.getElementById('popup-content');
        this.closer = document.getElementById('popup-closer');

        this.overlay= new Overlay({
          element: this.container,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        });
       
        let over = this.overlay;
        let clos = this.closer;
        this.closer.onclick  = function() {
          over.setPosition(undefined);
          clos.blur();
          return false;
        };

       this.vectorSource = new sourceVector({
          features: (new GeoJSON({
             projection: 'EPSG:900913',
          })).readFeatures(this.geojsonObject)
        });

       this.vectorSourceGeotecnico = new sourceVector({
        features: (new GeoJSON({
           projection: 'EPSG:900913',
        })).readFeatures(this.geojsonObject)
      });

      this.vectorSourceIncidente = new sourceVector({
        features: (new GeoJSON({
           projection: 'EPSG:900913',
        })).readFeatures(this.geojsonObject)
      });


      this.vectorSourceCapacitacion = new sourceVector({
        features: (new GeoJSON({
           projection: 'EPSG:900913',
        })).readFeatures(this.geojsonObject)
      });

       var clusterSource = new Cluster({
        distance: 25,
        source: this.vectorSource
      });
       var clusterSourceGeotecnico = new  Cluster({
        distance: 25,
        source: this.vectorSourceGeotecnico
      });
        /*{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [-8231320.23,-1469013.35]
          }
        }*/
       //this.vectorSource.addFeature(new Feature(new geomCircle([-8231320.23,-1469013.35], 2)));

       this.vectorLayer = new layerVector({
        source: this.vectorSource
        ,style: this.styleFunction
      });

       this.vectorLayerHeatMap = new Heatmap({
        source: this.vectorSource/*,
        blur: parseInt(blur.value, 10),
        radius: parseInt(radius.value, 10)*/
      });


      this.vectorLayerGeotecnico = new layerVector({
        source: this.vectorSourceGeotecnico
        ,style: this.styleFunctionGeotecnico
      });


       this.vectorLayerGeotecnicoHeatMap = new Heatmap({
        source: this.vectorSourceGeotecnico/*,
        blur: parseInt(blur.value, 10),
        radius: parseInt(radius.value, 10)*/
      });

      this.vectorLayerIncidente = new layerVector({
        source: this.vectorSourceIncidente
        ,style: this.styleFunctionIncidente
      });

       
      this.vectorLayerCapacitacion = new layerVector({
        source: this.vectorSourceCapacitacion
        ,style: this.styleFunctionCapacitacion
      });


      
      var styleCache = {};
      var  styleCluster = function(feature) {
          var size = feature.get('features').length;
          var style = styleCache[size];
          if (!style) {
            style = new Style({
              image: new Circle({
                radius: 10,
                stroke: new Stroke({
                  color: '#fff'
                }),
                fill: new Fill({
                  color: '#3399CC'
                })
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: '#fff'
                })
              })
            });
            styleCache[size] = style;
          }
          return style;
        }



       this.vectorLayerCluster = new layerVector({
        source: clusterSource,
        style:styleCluster
      });

       this.vectorLayerGeotecnicoCluster = new layerVector({
        visible: false,            
        source: clusterSourceGeotecnico,
        style:styleCluster
      });

       this.layerDistrito=new ImageLayer({            
             source: new ImageWMS({
               url: 'http://74.208.160.179:8080/serviciomapas/pmac_au/wms?service=WMS',
               params: {'LAYERS': 'pmac_au:distrito'},               
               serverType: 'geoserver',
               isBaseLayer: false,
               visible: false,
              active: false,
               visibility: false,
               ratio:1,
               projection: 'EPSG:900913'
             })
           });
       this.layerComunidad = new ImageLayer({             
             source: new ImageWMS({
               url: 'http://74.208.160.179:8080/serviciomapas/pmac_au/wms?service=WMS',
               params: {'LAYERS': 'pmac_au:comunidad'},              
               serverType: 'geoserver',
               ratio:1,               
               projection: 'EPSG:900913'
             })
           });

       this.layerDuctos =  new TileLayer({
            
             source: new TileWMS({
               url: 'http://74.208.160.179:8080/serviciomapas/pmac_au/wms?service=WMS',
               params: {'LAYERS': 'pmac_au:ductos', 'tiled': true},
               serverType: 'geoserver',
               isBaseLayer: false,
               projection: 'EPSG:900913'
             })
           });
       this.layerPoste = new TileLayer({
             
             source: new TileWMS({
               url: 'http://74.208.160.179:8080/serviciomapas/pmac_au/wms?service=WMS',
               params: {'LAYERS': 'pmac_au:poste_kilometrico', 'tiled': true},
               serverType: 'geoserver',
               isBaseLayer: false,              
               projection: 'EPSG:900913'
             })
           });

       this.layerDerechoVia = new TileLayer({
             
             source: new TileWMS({
               url: 'http://74.208.160.179:8080/serviciomapas/pmac_au/wms?service=WMS',
               params: {'LAYERS': 'pmac_au:derecho_via', 'tiled': true},
               serverType: 'geoserver',
               isBaseLayer: false,              
               projection: 'EPSG:900913'
             })
           });


         this.layerGoogleImage = new TileLayer({ 
            visible: true,            
            source: new TileImage({ url: 'http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}',
            isBaseLayer: true,
			type:'Aerial'})
           }) 

    /*     this.layerBINGImage = new TileLayer({
              preload: Infinity,
              isBaseLayer: true,
              visible: true,
              source: new ImageBINGLayer({
                type: 'BingMaps',
                key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
                imagerySet: 'Aerial'
              })
            }); */

        var layers = [

           //  this.layerBINGImage
           //, 
		     this.layerGoogleImage
           , this.layerDistrito
           , this.layerComunidad
           , this.layerDuctos
           , this.layerPoste
           , this.layerDerechoVia
           , this.vectorLayerHeatMap
           , this.vectorLayerGeotecnicoHeatMap

           , this.vectorLayerCluster
           , this.vectorLayerGeotecnicoCluster 

           , this.vectorLayer
           , this.vectorLayerGeotecnico

           , this.vectorLayerIncidente
           , this.vectorLayerCapacitacion
       ];




      this.map = new Map({
        layers: layers,
        overlays: [this.overlay],
        target: 'map',
        view: new View({
          //projection: 'EPSG:4326',
          center: [-8151320.23,-1389013.35],
          zoom: 9
        })
      });



       var select = new interactionSelect({
        layers: [this.vectorLayerGeotecnico,this.vectorLayer,this.vectorLayerIncidente,this.vectorLayerCapacitacion]//,
        //style: selectedStyle
      });
      this.map.addInteraction(select);

       var selectedFeatures = select.getFeatures();
       let over1=this.overlay;
       let con1=this.content;

        selectedFeatures.on('add', function(event) {

          con1.innerHTML = '';
          var feature = event.target.item(0);
                if(feature.get('capa')==1){
                 let coordinate = [feature.get('x1'),feature.get('y1')];
                  con1.innerHTML  = '<p style="text-align:center;"><b>'+feature.get('tipo_observacion')+'</b></p>' 
                  +'<p><b>Comunidad: </b>'+feature.get('com_nombre')+'</p>'
                  +'<p><b>Ubicación: </b>'+feature.get('ubicacion')+'</p>'
                  +'<p><b>Clasificación: </b>'+feature.get('clasificacion')+'</p>'
                  +'<p><b>Descripción: </b>'+feature.get('descripcion')+'</p>'
                  +'<p><b>Fecha de identificación: </b>'+feature.get('fecha_identificacion')+'</p>'
                  +'<p><b>Fecha último reporte: </b>'+feature.get('fecha_ultimo_reporte')+'</p>'
                  +'<p><b>Existente: </b>'+feature.get('existente')+'</p>'
                  +'<p><b>Fecha levantada: </b>'+feature.get('fecha_levantada')+'</p>'
                  //+'<p><img src="'+GLOBAL.url+'mapas/foto?tipo=2&id='+feature.get('nro')+'" />';
                  +'<p><img style="width:200px; height:100px" src="'+GLOBAL.url+'mapas/foto?tipo=1&id='+feature.get('nro')+'" />';

                 over1.setPosition(coordinate);    

                }else if(feature.get('capa')==2){

                 let coordinate = [feature.get('x1'),feature.get('y1')];
                  con1.innerHTML  = '<p style="text-align:center;"><b>'+feature.get('tipo_observacion')+'</b></p>' 
                  +'<p><b>Comunidad: </b>'+feature.get('com_nombre')+'</p>'
                  +'<p><b>Ubicación: </b>'+feature.get('ubicacion')+'</p>'
                  +'<p><b>Clasificación: </b>'+feature.get('clasificacion')+'</p>'
                  +'<p><b>Descripción: </b>'+feature.get('descripcion')+'</p>'
                  +'<p><b>Fecha de identificación: </b>'+feature.get('fecha_identificacion')+'</p>'
                  +'<p><b>Fecha último reporte: </b>'+feature.get('fecha_ultimo_reporte')+'</p>'
                  +'<p><b>Existente: </b>'+feature.get('existente')+'</p>'
                  +'<p><b>Fecha levantada: </b>'+feature.get('fecha_levantada')+'</p>'
                  //+'<p><img src="'+GLOBAL.url+'mapas/foto?tipo=1&id='+feature.get('com')+'" />';
                  +'<p><img style="width:200px; height:100px" src="'+GLOBAL.url+'mapas/foto?tipo=2&id='+feature.get('nro')+'" />';
                 over1.setPosition(coordinate);

                }else if(feature.get('capa')==3){
                  let fotos = feature.get('fotos');
                  //console.log(fotos)

                 let coordinate = [feature.get('inc_coordenada_3857_x'),feature.get('inc_coordenada_3857_y')];
                  con1.innerHTML  = '<p style="text-align:center;"><b>Incidente</b></p>' 
                  +'<p><b>Fecha: </b>'+feature.get('inc_fecha_reporte')+'</p>'
                  +'<p><b>KP: </b>'+feature.get('inc_kp')+'</p>'
                  +'<p><b>Descripción: </b>'+feature.get('inc_descripcion')+'</p>'
                  +'<p><b>Nro. Verificaciones: </b>'+feature.get('inc_nro_verificaciones')+'</p>'
                  +'<p><b>Nro. reportes: </b>'+feature.get('inc_nro_reportes')+'</p>'
                  +'<p><button type="button" class="btn btn-primary fotos" >Ver fotos ('+fotos.length+')</button></p>';

                  //+'<p><img src="'+GLOBAL.url+'mapas/foto?tipo=1&id='+feature.get('com')+'" />';
                 // +'<p><img style="width:200px; height:100px" src="'+GLOBAL.url+'mapas/foto?id=0&tipo=3&adicional='+fotos[0].inf_nombre_archivo+'" />';

                  parent.slides= [];
                  for(let i=0;i< fotos.length;i++){
                    parent.slides.push({image:GLOBAL.url+'mapas/foto?id=0&tipo=3&adicional='+fotos[i].inf_nombre_archivo});
                  }
                 /* this.slides = [
                    {image: 'assets/images/nature/7.jpg'},
                    {image: 'assets/images/nature/5.jpg'},
                    {image: 'assets/images/nature/3.jpg'}
                  ];*/
                  over1.setPosition(coordinate);
                  $(".fotos").on('click',function(){
                    parent.modalImagenes.show()
                  });
                
                }else if(feature.get('capa')==4){
                  let fotos = feature.get('fotos');
                  //console.log(fotos)

                 let coordinate = [feature.get('longitud'),feature.get('latitud')];
                  con1.innerHTML  = '<p style="text-align:center;"><b>Capacitación</b></p>' 
                  +'<table class="table"><tr><td><b>Fecha inicio: </b></td><td>'+feature.get('fecha_inicio')+'</td>'
                  +'<td><b>Fin: </b></td><td>'+feature.get('fecha_fin')+'</td>'
                  +'<td><b>Días: </b></td><td>'+feature.get('nro_dias')+'</td>'
                  +'<td><b>Horas: </b></td><td>'+feature.get('nro_horas')+'</td></tr>'

                  +'<tr><td><b>Lugar: </b></td><td colspan="3">'+feature.get('lugar')+'</td>'
                  +'<td><b>Tipo: </b></td><td colspan="3">'+feature.get('tipo_capacitacion')+'</td></tr>'


                  +'<tr><td><b>Componentes: </b></td><td colspan="7">'+feature.get('componentes')+'</td></tr>'

                  +'<tr><td><b>Temas: </b></td><td colspan="7">'+feature.get('temas')+'</td></tr>'

                  +'<tr><td><b>Responsables: </b></td><td colspan="7">'+feature.get('responsables')+'</td></tr>'

                  +'<tr><td colspan="2"><b>Asistentes varones: </b></td><td>'+feature.get('asistentes_varones')+'</td>'
                  +'<td colspan="2"><b>Asistentes mujeres: </b></td><td>'+feature.get('asistentes_mujeres')+'</td></tr>'

                  +'<tr><td><b>Monitores: </b></td><td>'+feature.get('pmac_monitores')+'</td>'
                  +'<td><b>Comité: </b></td><td>'+feature.get('pmac_comite')+'</td>'
                  +'<td><b>Técnicos: </b></td><td>'+feature.get('pmac_tecnicos')+'</td>'
                  +'<td><b>Autoridades: </b></td><td>'+feature.get('nro_autoridades')+'</td></tr>'

                  +'<tr><td colspan="4"><button type="button" class="btn btn-primary fotos" >Ver fotos ('+fotos.length+')</button></td></tr>';

                  //+'<p><img src="'+GLOBAL.url+'mapas/foto?tipo=1&id='+feature.get('com')+'" />';
                 // +'<p><img style="width:200px; height:100px" src="'+GLOBAL.url+'mapas/foto?id=0&tipo=3&adicional='+fotos[0].inf_nombre_archivo+'" />';

                  parent.slides= [];
                  for(let i=0;i< fotos.length;i++){
                    parent.slides.push({image:GLOBAL.url+'mapas/foto?id=0&tipo=4&adicional='+fotos[i].caf_nombre_archivo});
                  }
                 /* this.slides = [
                    {image: 'assets/images/nature/7.jpg'},
                    {image: 'assets/images/nature/5.jpg'},
                    {image: 'assets/images/nature/3.jpg'}
                  ];*/
                  over1.setPosition(coordinate);
                  $(".fotos").on('click',function(){
                    parent.modalImagenes.show()
                  });
                }

      });

      // when a feature is removed, clear the photo-info div
      selectedFeatures.on('remove', function(event) {
        //$('#photo-info').empty();
        //console.log("remove");
          over.setPosition(undefined);
          clos.blur();
      });

      this.cmbTipoGeotecnico = 1;
      this.cmbTipoAmbiental = 1;
/*
      map.addInteraction(this.selectSingleClick);


      this.selectSingleClick.on('select', function(e) {

        console.log('&nbsp;' +
            e.target.getFeatures().getLength() +
            ' selected features (last operation selected ' + e.selected.length +
            ' and deselected ' + e.deselected.length + ' features)');

        console.log( e.target.getFeatures());
     
         
      });
*//*
map.on('singleclick', function(evt) {                         
   var feature = map.forEachFeatureAtPixel(evt.pixel,
     function(feature, layer) {
       console.log(feature);
     // do stuff here with feature
     //return [feature, layer];                                  
   });                                                         
 });    
*/
/*
 map.on('singleclick', function(evt) {
        var coordinate = evt.coordinate;
        console.log(coordinate);
        var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'));

        con1.html = '<p>You clicked here:</p><code>' +
            '</code>';
        over1.setPosition(coordinate);
      });
*/
  
        this.vectorLayerGeotecnicoHeatMap.setVisible(false);
        this.vectorLayerHeatMap.setVisible(false);


        this.vectorLayerCluster.setVisible(false);
        this.vectorLayerGeotecnicoCluster .setVisible(false);

        this.formLoading = true;
        this._mapaService.incidente(
              {},
              data=>{
                for(var i=0;i<data.length;i++){      
                  //let coord1 = transform([data[i].x,data[i].y], 'EPSG:4326', 'EPSG:900913');     
                  let feat = new Feature();
                  data[i]["capa"] = 3;
                  feat.setProperties(data[i])
                  //let point1 = new point([data[i].y,data[i].x]);
                  let point1 = new point([
                     //transform([data[i].y,data[i].x], 'EPSG:4326', 'EPSG:900913')
                     data[i].inc_coordenada_3857_x,data[i].inc_coordenada_3857_y
                   ]);
                  feat.setGeometry(point1);       
                  //this.vectorSource.addFeature(new Feature(new geomCircle([data[i].x1,data[i].y1], 5)));
                  this.vectorSourceIncidente.addFeature(feat);
                  this.formLoading = false;
                }
                
              },error=>{
                  this.showMessage('error', 'Vuelva a intentar en unos minutos', '');
                  this.formLoading = false;
              }
          );
        this._mapaService.capacitacion(
              {},
              data=>{
                for(var i=0;i<data.length;i++){      
                  //let coord1 = transform([data[i].x,data[i].y], 'EPSG:4326', 'EPSG:900913');     
                  let feat = new Feature();
                  data[i]["capa"] = 4;
                  feat.setProperties(data[i])
                  //let point1 = new point([data[i].y,data[i].x]);
                  let point1 = new point([
                     //transform([data[i].y,data[i].x], 'EPSG:4326', 'EPSG:900913')
                     data[i].longitud,data[i].latitud
                   ]);
                  feat.setGeometry(point1);       
                  //this.vectorSource.addFeature(new Feature(new geomCircle([data[i].x1,data[i].y1], 5)));
                  this.vectorSourceCapacitacion.addFeature(feat);
                  this.formLoading = false;
                }
                
              },error=>{
                  this.showMessage('error', 'Vuelva a intentar en unos minutos', '');
                  this.formLoading = false;
              }
          );
    }


    submitFormAmbiental($ev, value: any) {
        this.vectorSource.clear();
        $ev.preventDefault();
        for (let c in this.formBuscarAmbiental.controls) {
            this.formBuscarAmbiental.controls[c].markAsTouched();
        }
        if (this.formBuscarAmbiental.valid) {     
          this.formLoading=true;  
          
           if(value.desde!=''){
            value.desde = value.desde.getFullYear()+"-"+(value.desde.getMonth()+1)+"-"+value.desde.getDate();

          }
          if(value.hasta!=''){
            value.hasta = value.hasta.getFullYear()+"-"+(value.hasta.getMonth()+1)+"-"+value.hasta.getDate();
          }

          this._mapaService.ambiental(
              value,
              data=>{
                this.showTable =false;
                for(var i=0;i<data.length;i++){      
                  //let coord1 = transform([data[i].x,data[i].y], 'EPSG:4326', 'EPSG:900913');     
                  let feat = new Feature();
                  data[i]["capa"] = 1;
                  feat.setProperties(data[i])
                  //let point1 = new point([data[i].y,data[i].x]);
                  let point1 = new point([
                     //transform([data[i].y,data[i].x], 'EPSG:4326', 'EPSG:900913')
                     data[i].x1,data[i].y1
                   ]);
                  feat.setGeometry(point1);       
                  //this.vectorSource.addFeature(new Feature(new geomCircle([data[i].x1,data[i].y1], 5)));
                  this.vectorSource.addFeature(feat);
                }
                if(!$("#chkLayerAmbiental").is(":checked")){
                  $("#chkLayerAmbiental").trigger('click');
                }
                this.modalAmbiental.hide();
                this.formLoading = false;
                this.tablaAmbientales = data;
                //this.count= data.length;
                this.showTabTable();
                this.selectTab(0);
                this.rows = data;
              },error=>{
                  this.showMessage('error', 'Vuelva a intentar en unos minutos', '');
                  this.formLoading = false;
              }
          );
        }
    }

    submitFormGeotecnico($ev, value: any) {
        this.vectorSourceGeotecnico.clear();
        $ev.preventDefault();
        for (let c in this.formBuscarGeotecnico.controls) {
            this.formBuscarGeotecnico.controls[c].markAsTouched();
        }
        if (this.formBuscarGeotecnico.valid) {
          if(value.desde!=''){
            value.desde = value.desde.getFullYear()+"-"+(value.desde.getMonth()+1)+"-"+value.desde.getDate();

          }
          if(value.hasta!=''){
            value.hasta = value.hasta.getFullYear()+"-"+(value.hasta.getMonth()+1)+"-"+value.hasta.getDate();
          }
          this.formLoading=true;      
           this._mapaService.geotecnico(
              value,
              data=>{
                
                for(var i=0;i<data.length;i++){      
                  //let coord1 = transform([data[i].x,data[i].y], 'EPSG:4326', 'EPSG:900913');     
                  let feat = new Feature();
                  data[i]["capa"] = 2;
                  feat.setProperties(data[i])
                  //let point1 = new point([data[i].y,data[i].x]);
                  let point1 = new point([
                     //transform([data[i].y,data[i].x], 'EPSG:4326', 'EPSG:900913')
                     data[i].x1,data[i].y1
                   ]);
                  feat.setGeometry(point1);       
                  //this.vectorSource.addFeature(new Feature(new geomCircle([data[i].x1,data[i].y1], 5)));
                  this.vectorSourceGeotecnico.addFeature(feat);
                }
                if(!$("#chkLayerGeotecnico").is(":checked")){
                  $("#chkLayerGeotecnico").trigger('click');
                }
                this.modalGeotecnico.hide();
                this.formLoading = false;
                this.tablaGeotecnicas = data;
                this.showTabTable();
                this.selectTab(1);
                this.rows2 = data;
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

    changeAmbiental(values){
      this.vectorLayer.setVisible(this.cmbTipoAmbiental==1?values.currentTarget.checked:false);
      this.vectorLayerCluster.setVisible(this.cmbTipoAmbiental==2?values.currentTarget.checked:false);
      this.vectorLayerHeatMap.setVisible(this.cmbTipoAmbiental==3?values.currentTarget.checked:false);

      
      this.chkLayerAmbiental = values.currentTarget.checked;
      this.showTabTable();
        if(this.chkLayerAmbiental){
          this.selectTab(0);
        }else{
          this.selectTab(1);
        }
    }

    changeCapaAmbiental(){
        this.vectorLayer.setVisible(this.cmbTipoAmbiental==1?true:false);
        this.vectorLayerCluster.setVisible(this.cmbTipoAmbiental==2?true:false);
        this.vectorLayerHeatMap.setVisible(this.cmbTipoAmbiental==3?true:false);
    }

    changeGeotecnico(values){
        this.vectorLayerGeotecnico.setVisible(this.cmbTipoGeotecnico==1?values.currentTarget.checked:false);
        this.vectorLayerGeotecnicoCluster.setVisible(this.cmbTipoGeotecnico==2?values.currentTarget.checked:false);
        this.vectorLayerGeotecnicoHeatMap.setVisible(this.cmbTipoGeotecnico==3?values.currentTarget.checked:false);

        this.chkLayerGeotecnico = values.currentTarget.checked;
        this.showTabTable();
        if(this.chkLayerGeotecnico){
          this.selectTab(1);
        }else{
          this.selectTab(0);
        }
    }


    changeCapaGeotecnico(){
        this.vectorLayerGeotecnico.setVisible(this.cmbTipoGeotecnico==1?true:false);
        this.vectorLayerGeotecnicoCluster.setVisible(this.cmbTipoGeotecnico==2?true:false);
        this.vectorLayerGeotecnicoHeatMap.setVisible(this.cmbTipoGeotecnico==3?true:false);
    }
    
    changeLayerDistrito(values){
      this.layerDistrito.setVisible(values.currentTarget.checked);
    }

    changeLayerComunidad(values){
      this.layerComunidad.setVisible(values.currentTarget.checked);
    }

    changeLayerDuctos(values){
      this.layerDuctos.setVisible(values.currentTarget.checked);
    }

    changeLayerPoste(values){
      this.layerPoste.setVisible(values.currentTarget.checked);
    }
    changeLayerDerechoVia(values){
      this.layerDerechoVia.setVisible(values.currentTarget.checked);
    }

    changeLayerIncidente(values){
      this.vectorLayerIncidente.setVisible(values.currentTarget.checked);
    }

    changeLayerCapacitacion(values){
      this.vectorLayerCapacitacion.setVisible(values.currentTarget.checked);
    }
	

    closeTable(){
      this.showTable = !this.showTable;
    }
    showTabTable(){
      if((this.chkLayerGeotecnico && this.tablaGeotecnicas.length > 0) || (  this.chkLayerAmbiental && this.tablaAmbientales.length > 0)){
          this.showTable = false;
        }else{
          this.showTable = true;
        }

        this.staticTabs.tabs[0].disabled = this.tablaAmbientales.length > 0 && this.chkLayerAmbiental?false:true;
        
        this.staticTabs.tabs[1].disabled = this.tablaGeotecnicas.length > 0 && this.chkLayerGeotecnico?false:true;
        
    } 
    selectTab(tab_id: number) {
      this.staticTabs.tabs[tab_id].active = true;
    }
    hiddenTab(tipo){

      if(tipo == 1){
        if(this.tablaAmbientales.length > 0 && this.chkLayerAmbiental){
          return false;
        }else{
          return true;
        }
      }else{
        if(this.tablaGeotecnicas.length > 0 && this.chkLayerGeotecnico){
          return false;
        }else{
          return true;
        }
      }
    }
    
     onSelect({ selected }) {
      //console.log(selected)
      if(selected){
        if(selected[0].x1!=null && selected[0].y1!=null){ 
            this.map.setView(new View({
                  //center: ol.proj.transform([-8151320.23,-1389013.35], 'EPSG:3857', 'EPSG:4326'),
                  center: [selected[0].x1,selected[0].y1],
                  zoom: 18
           }));
        }
      }

    }
    onActivate(event){

    }
    onSelect2({ selected }) {
      if(selected){
        if(selected[0].x1!=null && selected[0].y1!=null){ 
            this.map.setView(new View({
                  //center: ol.proj.transform([-8151320.23,-1389013.35], 'EPSG:3857', 'EPSG:4326'),
                  center: [selected[0].x1,selected[0].y1],
                  zoom: 18
           }));
        }
      }
    }
}
/*
  function successHandler(data) {
      var transform = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
      data.items.forEach(function(item) {
        var feature = new ol.Feature(item);
        feature.set('url', item.media.m);
        var coordinate = transform([parseFloat(item.longitude), parseFloat(item.latitude)]);
        var geometry = new ol.geom.Point(coordinate);
        feature.setGeometry(geometry);
        flickrSource.addFeature(feature);
      });
    }*/