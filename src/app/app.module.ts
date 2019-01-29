import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Camera } from '@ionic-native/camera/ngx';
import { ModelPage } from '../app/model/model.page'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';

import { NetworkService } from './servicios/network.service';
import { Network } from '@ionic-native/network/ngx';

import { ThemeSwitcheService } from './servicios/theme-switche.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { IonicStorageModule } from '@ionic/storage';

import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function setTranslateLoader(http: any) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, ModelPage],
  entryComponents: [ModelPage],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule, TranslateModule.forRoot({  //Módulo de traducción
      loader: {
        provide: TranslateLoader, 
        useFactory: (setTranslateLoader), 
        deps: [HttpClient]
      }
    })  
  ],
  providers: [
    StatusBar,
    ThemeSwitcheService,
    SplashScreen,
    FormsModule, ReactiveFormsModule,
    Camera,
    NativeStorage,
    SocialSharing, //Servicio de redes sociales:nativo
    Network,  //Servicio de conexiones de red:nativo
    NetworkService,  //Servicio para notificar si estamos sin red y ejecutar las tareas adecuadas
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
