import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-model',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss'],
})
export class ModelPage implements OnInit {

  private todo: FormGroup;
  private id: any;
  private title: any;
  private myphoto: string;

  constructor(private modalCtrl: ModalController,
            private camera: Camera) { }

  ngOnInit() {
  }

  logForm() {
    /*let data = {
      title: this.todo.get("title").value,
      description: this.todo.get("description").value
    };
    // Mostramos el cargando...
    this.myloading = this.presentLoading();
    this.todoS.actualizaNota(this.id, data)
      .then((docRef) => {
        // Cerramos el cargando...
        this.loadingController.dismiss();
        // Podríamos ir a la página de listado
        this.modalCtrl.dismiss();
      })
      .catch((error) => {
        // Cerramos el cargando...
        this.loadingController.dismiss();
        // Mostramos un mensaje de error
      });*/
  }

  /*async presentLoading() {
    this.myloading = await this.loadingController.create({
      message: 'Editando Tarea...'
    });
    return await this.myloading.present();
  }*/

  // Funcionalidad de la cámara
  openCamera(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
  }

  // Funcionalidad de la galería
  openGallery(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
  }

  /* Cierra el modal */
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}
