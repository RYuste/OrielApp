import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TodoservicioService {

  myCollection: any;

  constructor(private fireStore: AngularFirestore) {
    /*Crea una referencia a la colección 'todo' que empleamos para realizar las
   operaciones CRUD*/
    this.myCollection = fireStore.collection<any>(environment.firebaseConfig.todoColeccion);
  }

  /*
  Recibe un objeto y lo guarda como un documento nuevo en la colección 'todo'.
  Devuelve un Promise
  */
  guardarImagen(datos) {
    return this.myCollection.add(datos);
  }

  /*
  Recupera todos los documentos de la colección 'todo'.
  Devuelve un Observable
  */
  leeDatos() {
    return this.myCollection.get();
  }

  /*
  Elimina el documento identificado por id de la colección 'todo'.
  Devuelve un Promise
  */
  borraNota(id) {
    return this.myCollection.doc(id).delete();
  }
}
