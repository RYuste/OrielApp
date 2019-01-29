import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThemeSwitcheService } from './servicios/theme-switche.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { LocalDBService} from '../app/servicios/local-db.service';

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
    private themeS: ThemeSwitcheService,
    private translate: TranslateService,
    private localDB: LocalDBService
  ) {
    this.initializeApp();
    this.skinmenu = (environment.defaultSkin == "light" ? false : true);
    this.langmenu = (environment.defaultLanguage == "es" ? false : true);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //Cargamos el estilo y el idioma por defecto
      this.themeS.setTheme(environment.defaultSkin);
      this.translate.setDefaultLang(environment.defaultLanguage);
    });
    this.localDB.initChecking().then(() => {
      //Cargamos las preferencias del usuario
      this.themeS.setTheme(this.localDB.getSkin());
      this.translate.use(this.localDB.getLang());
    });
  }

  /* Cambia el tema a light o dark */
  changeSkin(e) {
    if (e.detail.checked) {
      this.localDB.setSkin("dark");
      this.themeS.setTheme("dark");
    } else {
      this.localDB.setSkin("light");
      this.themeS.setTheme("light");
    }
  }

  /* Cambia el idioma a español o ingles */
  changeLang(e) {
    if (e.detail.checked) {
      this.localDB.setLang("en");
      this.translate.use("en");
    } else {
      this.localDB.setLang("es");
      this.translate.use("es");
    }
  }
}
