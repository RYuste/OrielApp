import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TodoservicioService {

  myCollection: any;
  myCollectionLike: any;

  constructor(private fireStore: AngularFirestore) {
    /*Crea una referencia a la colección 'todo' y 'likes' que empleamos para realizar las
   operaciones CRUD*/
    this.myCollection = fireStore.collection<any>(environment.firebaseConfig.todoColeccion);
    this.myCollectionLike = fireStore.collection<any>(environment.firebaseConfig.likeColeccion);
  }
  
  /*
  Recupera un documento por id de la colección 'likes'.
  Devuelve un Observable.
  *//*
  leeLikes(id){
    return this.myCollectionLike.doc(id).get("idLike");
  }*/

  /*
  Recibe un objeto y lo guarda como un documento nuevo en la colección 'likes'.
  Devuelve un Promise.
  *//*
  añadeLikes(id){
    return this.myCollectionLike.add(id);
  }*/




  /*
  Recibe un objeto y lo guarda como un documento nuevo en la colección 'todo'.
  Devuelve un Promise.
  */
  guardarImagen(datos) {
    return this.myCollection.add(datos);
  }

  /*
  Recupera todos los documentos de la colección 'todo'.
  Devuelve un Observable.
  */
  leeDatos() {
    return this.myCollection.get();
  }

  /*
  Elimina el documento identificado por id de la colección 'todo'.
  Devuelve un Promise.
  */
  borraNota(id) {
    return this.myCollection.doc(id).delete();
  }
}
