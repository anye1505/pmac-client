
import { Injectable } from  '@angular/core';
import { RequestMethod,Http } from '@angular/http';
import { ResourceCRUD,ResourceParams, ResourceMethod, ResourceAction,Resource  } from 'ngx-resource';

import { Rest } from  '../resources/rest.resource';


import { GLOBAL } from '../global';

@Injectable()
@ResourceParams({
 	url:GLOBAL.url/*,
 	headers:{
 		'Accept': 'application/json',
    	'Content-Type': 'application/json'
 	}*/
})

//crud default
//export class NewRes extends ResourceCRUD<IQueryInput, INewsShort, INews> {}

export class MapaService extends Rest{
	


	@ResourceAction({
	    method: RequestMethod.Get,
	    path: '/mapas/ambiental',
	    auth: true,
	    isArray:true
	})
	ambiental:ResourceMethod<any,any>;

	@ResourceAction({
	    method: RequestMethod.Get,
	    path: '/mapas/geotecnico',
	    auth: true,
	    isArray:true
	})
	geotecnico:ResourceMethod<any,any>;


	@ResourceAction({
	    method: RequestMethod.Get,
	    path: '/mapas/param',
	    auth: true
	})
	param:ResourceMethod<any,any>;

	@ResourceAction({
	    method: RequestMethod.Get,
	    path: '/mapas/incidente',
	    auth: true,
	    isArray:true
	})
	incidente:ResourceMethod<any,any>;


	@ResourceAction({
	    method: RequestMethod.Get,
	    path: '/mapas/capacitacion',
	    auth: true,
	    isArray:true
	})
	capacitacion:ResourceMethod<any,any>;
}
