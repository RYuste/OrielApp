import { Injectable, Inject  } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomController } from '@ionic/angular';
 
interface Theme {
  name: string;
  styles: ThemeStyle[];
}
 
interface ThemeStyle {
  themeVariable: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio encargado de cambiar el tema de la aplicación.
 */
export class ThemeSwitcheService {

  private themes: Theme[] = [];
  private currentTheme: number = 0;
 
  constructor(private domCtrl: DomController, @Inject(DOCUMENT) private document) {
 
    this.themes = [
      {
        name: 'light',
        styles: [
          { themeVariable: '--ion-color-primary', value: '#FF9900'},
          { themeVariable: '--ion-color-primary-rgb', value: '56, 128, 255'},
          { themeVariable: '--ion-color-primary-contrast', value: '#ffffff'},
          { themeVariable: '--ion-color-primary-contrast-rgb', value: '255,255,255'},
          { themeVariable: '--ion-color-primary-shade', value: '#fcbd48'},
          { themeVariable: '--ion-color-primary-tint', value: '#fcbd48'},
          { themeVariable: '--ion-item-color', value: '#000'},
          { themeVariable: '--ion-color-text', value: '#000'},
          { themeVariable: '--ion-item-ios-background-color', value: '#ffffff'},
          { themeVariable: '--ion-item-md-background-color', value: '#ffffff'},
          { themeVariable: '--ion-tabbar-background-color', value: '#222428'},
          { themeVariable: '--ion-tabbar-ios-text-color-active', value: '#ffffff'},
          { themeVariable: '--ion-tabbar-md-text-color-active', value: '#ffffff'},
          { themeVariable: '--ion-background-color', value: '#ffffff'},
          { themeVariable: '--ion-color-tertiary', value: '#663BC9'},
          { themeVariable: '--ion-toggle-handle-background-color', value: '#0b89a7'},
          { themeVariable: '--ion-color-success', value: '#10dc60'}
        ]
      },
      {
        name: 'dark',
        styles: [
          { themeVariable: '--ion-color-primary', value: '#f77119'},
          { themeVariable: '--ion-color-primary-rgb', value: '34,34,34'},
          { themeVariable: '--ion-color-primary-contrast', value: '#ffffff'},
          { themeVariable: '--ion-color-primary-contrast-rgb', value: '255,255,255'},
          { themeVariable: '--ion-color-primary-shade', value: '#FF9900'},
          { themeVariable: '--ion-color-primary-tint', value: '#FF9900'},
          { themeVariable: '--ion-item-color', value: '#FFF'},
          { themeVariable: '--ion-color-text', value: '#FFF'},
          { themeVariable: '--ion-item-ios-background-color', value: '#717171'},
          { themeVariable: '--ion-item-md-background-color', value: '#717171'},
          { themeVariable: '--ion-tabbar-background-color', value: '#222428'},
          { themeVariable: '--ion-tabbar-ios-text-color-active', value: '#ffffff'},
          { themeVariable: '--ion-tabbar-md-text-color-active', value: '#ffffff'},
          { themeVariable: '--ion-background-color', value: '#383838'},
          { themeVariable: '--ion-color-tertiary', value: '#663BC9'},
          { themeVariable: '--ion-toggle-handle-background-color', value: '#ffffff'},
          { themeVariable: '--ion-color-success', value: '#004d00'}
        ]
      }
    ]
 
  }
  
  /**
   * Cambia un tema por otro.
   * @param name 
   */
  setTheme(name): void {
    let theme = this.themes.find(theme => theme.name === name);
 
    this.domCtrl.write(() => {
      theme.styles.forEach(style => {
        document.documentElement.style.setProperty(style.themeVariable, style.value);
      });
    });
  }

  cycleTheme(): void {
    if(this.themes.length > this.currentTheme + 1){
      this.currentTheme++;
    } else {
      this.currentTheme = 0;
    }
    this.setTheme(this.themes[this.currentTheme].name);
  }
}
