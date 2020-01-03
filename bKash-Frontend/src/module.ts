import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from "bootstrap"
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { PreloadAllModules } from './apppreloader';
import {RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha';

//Components
import { AppComponent } from './component';
import { HomeComponent } from './home/component';
import { ErrorComponent } from './error/component';

const routes: Routes = [

    {
        path: '',
        component: HomeComponent
    },
    {
        path: '**',
        component: ErrorComponent
    },
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(
            routes,
            {
                //enableTracing: false,
                useHash: false,
                preloadingStrategy: PreloadAllModules
            }),
        RecaptchaModule,
        RecaptchaFormsModule
    ],

    declarations: [
        AppComponent,
        HomeComponent,
        ErrorComponent],

    bootstrap: [AppComponent],

    providers: [
        Title,
        PreloadAllModules,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: { 
                siteKey: '6Lc8E8MUAAAAAJ6lY4GMJpJesd3_X-b23Xsapaxc',
            } as RecaptchaSettings
        }
    ],

    exports: [RouterModule]
})

export class AppModule {

}