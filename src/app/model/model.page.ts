import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonImg, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { TodoservicioService } from '../servicios/todoservicio.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss'],
})
export class ModelPage implements OnInit {

  @ViewChild('mifoto') elemElem:IonImg;
  private todo: FormGroup;
  private myphoto: any;
  private myloading: any;

  constructor(private formBuilder: FormBuilder,
            private modalCtrl: ModalController,
            private camera: Camera,
            private todoServ: TodoservicioService,
            private toastCtrl: ToastController,
            public loadingController: LoadingController) {

    // Imágen por defecto al iniciar el model
    this.myphoto = "assets/images/imgDefault.png";
    
    // Validaciones
    this.todo = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  /* Ejecuta el submit del formulario. Crea un objeto proveniente del formulario 
  y llama a la función 'guardarImagen' del servicio. Gestiona la
  Promise para sincronizar la interfaz. */
  logForm() {
      let data = {
        title: this.todo.get("title").value,
        img: this.elemElem.src
      };
      // Si no se ha cargado ninguna imágen, salta un error
      if(this.elemElem.src == "assets/images/imgDefault.png"){
        this.toastShow('Añade una foto para Guardar.');
      }else{
      // Mostramos el cargando... 
      this.myloading = this.presentLoading();
      this.todoServ.guardarImagen(data)
        .then((docRef) => {
          console.log("ID insertado: ", docRef.id);
          // Cerramos el cargando...
          this.loadingController.dismiss();
          // Cierra el modal
          this.cerrarModal();
        })
        .catch((error) => {
          console.error("Error al guardar: ", error);
          // Cerramos el cargando...
          this.loadingController.dismiss();
          // Mostramos un mensaje de error 
          this.toastShow('No se ha podido guardar la imágen.');
        });
      }
  }

  // Componente de la interfaz IONIC v4
  async presentLoading() {
    this.myloading = await this.loadingController.create({
      message: 'Guardando...'
    });
    return await this.myloading.present();
  }

  // Funcionalidad de la cámara
  openCamera(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 600,
      targetWidth: 600
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.myphoto = base64Image;
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
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetHeight: 600,
      targetWidth: 600
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.myphoto = base64Image;
     }, (err) => {
      // Handle error
     });
  }

  /* Cierra el modal */
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  /* Mensaje informativo con "toast" */
  async toastShow(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 4000
    });
    toast.present();
  }

}
