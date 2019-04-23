
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

export class IndicadorService extends Rest{
	


	@ResourceAction({
	    method: RequestMethod.Get,
	    path: '/indicadores/param',
	    auth: true
	})
	param:ResourceMethod<any,any>;



	@ResourceAction({
	    method: RequestMethod.Get,
	    path: '/indicadores/consulta',
	    auth: true
	})
	consulta:ResourceMethod<any,any>;
	
	@ResourceAction({
	    method: RequestMethod.Get,
	    path: '/indicadores/controlAcceso',
	    auth: true
	})
	controlAcceso:ResourceMethod<any,any>;

	@ResourceAction({
	    method: RequestMethod.Get,
	    path: '/indicadores/gestionSocial',
	    auth: true
	})
	gestionSocial:ResourceMethod<any,any>;
	
}
