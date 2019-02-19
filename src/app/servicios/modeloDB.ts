/**
 * Base de datos Local.
 */
export interface iModeloDB{
    lang?:string, // idioma
    skin?:string, // tema
    like?:string[], // likes
    checkedToggleSkin?: boolean, // true (si está pulsado el botón) o false
    checkedToggleLang?: boolean // true (si está pulsado el botón) o false
  }