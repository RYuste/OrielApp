import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { iModeloDB } from '../servicios/modeloDB';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para trabajar con la base de datos local.
 */
export class LocalDBService {
  datos: iModeloDB = {};

  constructor(private storage: Storage, public httpClient: HttpClient) { 
    this.datos.skin = environment.defaultSkin;
    this.datos.lang = environment.defaultLanguage;
  }

  /**
   * Carga las variables de la base de datos local.
   */
  initChecking() {
    return new Promise((resolve, reject) => {
      this.storage.get('datos').then((val: iModeloDB) => {
        if (val && val != {} && val != "" && val != [] && val != "[]") {
          this.datos = val;
        }
        resolve("Datos cargados correctamente.");
      })
        .catch(err => {
          console.log(err);
          reject("Error al cargar los datos locales.");
        });
    });
  }
  
  /**
   * Get de los likes.
   * @param val 
   */
  getLike(val) {
    console.log(val);
    return this.storage.get(val);
  }
  /**
   * Set de los likes.
   * @param id 
   * @param val 
   */
  setLike(id, val){
    this.datos.like = val;
    return this.storage.set(id, this.datos);
  }

  /**
   * Get del idioma.
   */
  getLang() {
    return this.datos.lang;
  }
  /**
   * Set del idioma.
   * @param val 
   */
  setLang(val) {
    this.datos.lang = val;
    return this.storage.set("datos", this.datos);
  }

  /**
   * Get del tema.
   */
  getSkin() {
    return this.datos.skin;
  }
  /**
   * Set del tema.
   * @param val 
   */
  setSkin(val) {
    this.datos.skin = val;
    return this.storage.set("datos", this.datos);
  }

  /**
   * Get para comprobar si el toggle del tema está pulsado o no.
   */
  getCheckedToggleSkin(){
    return this.datos.checkedToggleSkin;
  }
  /**
   * Set para comprobar si el toggle del tema está pulsado o no.
   * @param val 
   */
  setCheckedToggleSkin(val){
    this.datos.checkedToggleSkin = val;
    return this.storage.set("datos", this.datos);
  }

  /**
   * Get para comprobar si el toggle del idioma está pulsado o no.
   */
  getCheckedToggleLang(){
    return this.datos.checkedToggleLang;
  }
  /**
   * Set para comprobar si el toggle del idioma está pulsado o no.
   * @param val 
   */
  setCheckedToggleLang(val){
    this.datos.checkedToggleLang = val;
    return this.storage.set("datos", this.datos);
  }
}
