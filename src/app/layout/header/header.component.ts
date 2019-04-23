import { Component, OnInit, ViewChild } from '@angular/core';
import { Router }      from '@angular/router';
const screenfull = require('screenfull');
const browser = require('jquery.browser');
declare var $: any;

import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import { GLOBAL } from '../../global';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    navCollapsed = true; // for horizontal layout
    menuItems = []; // for horizontal layout

    isNavSearchVisible: boolean;
    @ViewChild('fsbutton') fsbutton;  // the fullscreen button


    public identity;
    public token;
    constructor(
        public menu: MenuService,
        public userblockService: UserblockService, 
        public settings: SettingsService,
        private _authService:AuthService,
        private _userService:UserService,
        private router: Router
    ) {

        this.checkToken();
        this.initListener();
        this.initInterval();

        // show only a few items on demo
        this.menuItems = menu.getMenu().slice(0,4); // for horizontal layout
    }

    ngOnInit() {
        this.isNavSearchVisible = false;
        if (browser.msie) { // Not supported under IE
            this.fsbutton.nativeElement.style.display = 'none';
        }


        this.identity = this._authService.getIdentity();
        this.token = this._authService.getToken();
    }


    initListener(){    
        document.body.addEventListener('click', () => this.reset());
        document.body.addEventListener('mouseover',()=> this.reset());
        document.body.addEventListener('mouseout',() => this.reset());
        document.body.addEventListener('keydown',() => this.reset());
        document.body.addEventListener('keyup',() => this.reset());
        document.body.addEventListener('keypress',() => this.reset());
    }


    initInterval(){        
        setInterval(() => {
           this.checkToken();
        }, GLOBAL.checkInterval);
    }

    reset(){
        this.identity = this._authService.getIdentity();
        if(this.identity!=null){
          let dt=new Date();
          this.identity.lastAction=dt.getTime() / 1000;
          this._authService.setLocalStorarge('identity',JSON.stringify(this.identity));
          //localStorage.setItem('identity',JSON.stringify(this.identity));
        }
    }

    checkToken(){
         this.identity = this._authService.getIdentity();
         if(this.identity!=null){
            let dt=new Date();
            let now = dt.getTime() / 1000;
            let ses =this.identity.lastAction + GLOBAL.segundos_autologout;
            if(ses <= now){         
                  this.logout(); 
            }else{
              let init = this.identity.init + this.identity.ttl;

              if(init <= now){
                  this.logout();
              }          
            }
          }
    }


    toggleUserBlock(event) {
        event.preventDefault();
        this.userblockService.toggleVisibility();
    }

    openNavSearch(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setNavSearchVisible(true);
    }

    setNavSearchVisible(stat: boolean) {
        // console.log(stat);
        this.isNavSearchVisible = stat;
    }

    getNavSearchVisible() {
        return this.isNavSearchVisible;
    }

    toggleOffsidebar() {
        this.settings.layout.offsidebarOpen = !this.settings.layout.offsidebarOpen;
    }

    toggleCollapsedSideabar() {
        this.settings.layout.isCollapsed = !this.settings.layout.isCollapsed;
    }

    isCollapsedText() {
        return this.settings.layout.isCollapsedText;
    }

    toggleFullScreen(event) {

        if (screenfull.enabled) {
            screenfull.toggle();
        }
        // Switch icon indicator
        let el = $(this.fsbutton.nativeElement);
        if (screenfull.isFullscreen) {
            el.children('em').removeClass('fa-expand').addClass('fa-compress');
        }
        else {
            el.children('em').removeClass('fa-compress').addClass('fa-expand');
        }
    }

    logout(){
        this._userService.logout();  
        this._authService.logout();        
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.clear();     
        this.router.navigate(['login']);        
    }
}
