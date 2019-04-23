import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { GLOBAL } from '../../../global';


import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { UserCreate } from '../../../models/user';


import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'user-create',
    templateUrl: './user-create.component.html'
})
export class UserCreateComponent implements OnInit {
	identity;
   	formLoading:boolean;
    valForm: FormGroup;

    public userCreate:UserCreate;

    toaster: any;
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });

    sucursales:any;
    empresas:any;

    constructor(
    	fb: FormBuilder,
    	private _authService:AuthService,
    	private _userService:UserService,         	
        public toasterService: ToasterService
    ) {

        this.userCreate = new UserCreate('','','','','',GLOBAL.realm);
    	this.identity=this._authService.getIdentity();
    	let password = new FormControl('', Validators.required);
        let certainPassword = new FormControl('', CustomValidators.equalTo(password));

        // Model Driven validation
        this.valForm = fb.group({
            'username': ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9.]+$')])],
            'name': ['', Validators.compose([Validators.required,Validators.pattern('^[\u00F1A-Za-z _]*[\u00F1A-Za-z][\u00F1A-Za-z _]*$')])],
            'surname': ['',Validators.compose([Validators.required,Validators.pattern('^[\u00F1A-Za-z _]*[\u00F1A-Za-z][\u00F1A-Za-z _]*$')])],
            'email': ['',Validators.compose([Validators.required,CustomValidators.email])],
            'passwordGroup': fb.group({
                password: password,
                confirmPassword: certainPassword
            })
        });

    }

    ngOnInit() {

    }



    submitForm($ev, value: any) {
    	this.formLoading = true;
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {            
    		this.userCreate.username=value.username;
            this.userCreate.name=value.name;
            this.userCreate.surname = value.surname;            
            this.userCreate.email = value.email;
            this.userCreate.password = value.passwordGroup.password;      
			this._userService.create(this.userCreate,  
			(user)  =>  {			
				this.toasterService.pop('success', "Usuario creado", "");
				this.formLoading = false;
                //$("#spanUser").html(value.username+", "+value.surname);
			},
			error => {
			  if(error.status===401){
				this.toasterService.pop('warning', "Ud. no cuenta con permiso para crear la información", '');			    
			  }else{
                  if(error.status===422){
                    this.toasterService.pop('warning', "Usuario y/o email ya existe", '');                
                  }else{
				    this.toasterService.pop('error', "Vuelvalo a intentar en unos minutos", '');
                }
			  }
			  this.formLoading = false;
			});
        }else{
    		this.formLoading = false;
        }
        
    }

}
