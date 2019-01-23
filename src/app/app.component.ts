import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThemeSwitcheService } from './servicios/theme-switche.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  private langmenu: any;
  private skinmenu: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private themeS: ThemeSwitcheService
  ) {
    this.initializeApp();
    this.skinmenu = (environment.defaultSkin == "light" ? false : true);
    //this.langmenu = (environment.defaultLanguage == "es" ? false : true);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /* Cambia el tema a light o a dark */
  changeSkin(e) {
    if (e.detail.checked) {
      this.themeS.setTheme("dark");
    } else {
      this.themeS.setTheme("light");
    }
  }

  /*changeLang(e) {
    //console.log(e.detail.checked);
    if (e.detail.checked) {
      this.authS.setLang("en");
      this.translate.use("en");
    } else {
      this.authS.setLang("es");
      this.translate.use("es");
    }
  }*/
}
