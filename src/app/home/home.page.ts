import { Component,ViewChild} from '@angular/core';
import { IonSlides, LoadingController, AlertController, ModalController,
          ActionSheetController, ToastController } from '@ionic/angular';
import { ModelPage } from '../model/model.page';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LocalDBService} from '../servicios/local-db.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;

  private listado = [];
  private listadoPanel = [];
  private listadoPanelFav = [];

  private ishackingme = null;
  private ishackingmeCont = 0;

  private visibleLike: any;
  private visibleBasura = false;

  private tabs = ["selectTab(0)", "selectTab(1)"];
  private category: any = "0";
  private ntabs = 2;
  private SwipedTabsIndicator: any = null;


  constructor(public modalCtrl: ModalController,
              private social: SocialSharing,
              private todoServ: TodoservicioService,
              private alertCtrl: AlertController,
              private sheetCtrl: ActionSheetController,
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private localDB: LocalDBService,
              public loadingController: LoadingController) { }

  ngOnInit() {
  }

  /* Almacena los 'likes' dados en la imágen */
  meGusta(id) {
    this.localDB.getLike(id).then((val) => {
      console.log(id);
      console.log(val);

      // Si existe este id en local no hago nada y muestro mensaje
      if (val != null) {
        this.toastShow(this.translate.instant("votado"));
      } else {
        console.log("NO he votado aún");
        this.presentLoading(this.translate.instant("cargando"));

        this.todoServ.leeLikes(id).subscribe((datos) => {
          console.log(datos);
          // Si ya existe lo actualiza, sino, lo crea
          if (datos.exists) {
            let data = {
              contLikes: +datos.data()['contLikes'] + 1
            };
            // Actualizar el nuevo valor
            this.todoServ.actualizaLikes(id, data)
              .then((docRef) => {
                // Guarda el id en local para saber que ya ha votado
                this.localDB.setLike(id, data);
                // Cerramos el cargando...
                this.loadingController.dismiss();
                this.toastShow(this.translate.instant("votadoNuevo"));
              });
          } else {
            let data = {
              contLikes: 1
            };
            // Crear el nuevo valor
            this.todoServ.añadeLikes(id, data).then((docRef) => {
              // Guarda el id en local para saber que ya ha votado
              this.localDB.setLike(id, data);
              // Cerramos el cargando...
              this.loadingController.dismiss();
              this.toastShow(this.translate.instant("votadoNuevo"));
            });
          }
        });
      }
    });
  }

  /* Compartir imágen por redes sociales */
  async compartir(item) {
    const actionSheet = await this.sheetCtrl.create({
      header: this.translate.instant("compartir"),
      buttons: [{
        text: 'WhatsApp',
        icon: 'logo-whatsapp',
        handler: () => {
          this.social.shareViaWhatsApp(null, item.img, null).then(() => {
            // Success
          }).catch((e) => {
            // Error!
            this.toastShow(this.translate.instant("compartirErrorWhatsApp"));
          });
        }
      }, {
        text: 'Twitter',
        icon: 'logo-twitter',
        handler: () => {
          this.social.shareViaTwitter(null, item.img, null).then(() => {
            // Success
          }).catch((e) => {
            // Error!
            this.toastShow(this.translate.instant("compartirErrorTwitter"));
          });
        }
      }, {
        text: 'Instagram',
        icon: 'logo-instagram',
        handler: () => {
          this.social.shareViaInstagram(null, item.img).then(() => {
            // Success
          }).catch((e) => {
            // Error!
            this.toastShow(this.translate.instant("compartirErrorInstagram"));
          });
        }
      }, {
        text: 'Facebook',
        icon: 'logo-facebook',
        handler: () => {
          this.social.shareViaFacebook(null, item.img, null).then(() => {
            // Success
          }).catch((e) => {
            // Error!
            this.toastShow(this.translate.instant("compartirErrorFacebook"));
          });
        }
      }]
    });
    await actionSheet.present();
  }

  /* Oculta o revela el botón de eliminarImagen */
  mostrarBotonEliminar(){
    clearTimeout(this.ishackingme);
    this.ishackingmeCont++;
    if(this.ishackingmeCont>9){
      // Hace visible el boton
      this.visibleBasura = true; 
    }else{
      // Si no hemos pulsado todas las veces;
      this.ishackingme=setTimeout(()=>{this.ishackingmeCont=0;},
      800);
    }
  }

  /* Muestra una alerta para eliminar una imágen */
  async eliminarImagen(id){
    const alert = await this.alertCtrl.create({
      header: this.translate.instant("eliminarImagen"),
      message: this.translate.instant("eliminarPrg"),
      buttons: [
        {
          text: this.translate.instant("cancel"),
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translate.instant("eliminar"),
          handler: () => {
            console.log('Delete Okay');
            this.todoServ.borraImagen(id); // Elimina la imágen
            this.todoServ.borraLike(id); // Elimina los 'likes' de la imagén borrada
            this.ionViewDidEnter();
          }
        }
      ]
    });
    await alert.present();
  }

  /* Buscador */
  getFilteredItem(ev: any, refresher) {
    // set val to the value of the searchbar
    const val = ev.target.value;

    // Filtra por título
    if (val && val.trim() != '') {
      this.listadoPanel = this.listado.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{ // Refresca las lista cuando se vacía el buscador
      this.doRefresh(refresher);
    }
  }

  // Abre un modal para añadir una imágen
  async abrirModel(){
    this.presentLoading(this.translate.instant("cargando"));
    const modal = await this.modalCtrl.create({
      component: ModelPage
    });
    modal.onDidDismiss();
    this.loadingController.dismiss();
    await modal.present();
  }

  /* Se ejecuta cuando la página ha entrado completamente 
  y ahora es la página activa. */
  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");

    this.presentLoading(this.translate.instant("cargando"));
    this.todoServ.leeDatos()
      .subscribe((querySnapshot) => {
        this.listado = [];
        querySnapshot.forEach((doc) => {
          this.listado.push({ id: doc.id, ...doc.data(), contLikes: 0});
        });
        console.log(this.listado);
        this.listadoPanel = this.listado;

        // Hemos terminado de cargar todas las imágenes , ahora los likes;
        this.todoServ.leeLikesOrdenados()
          .then((querySnapshot) => {
            querySnapshot.forEach((docu) => {
              // Busco en this.listado lo que tengan el mismo doc.id y añado countLikes
              let indexe = this.listado.find(index => index.id === docu.id);
              indexe.contLikes = docu.data().contLikes;
            });
            // He terminado de cargar los likes
            console.log(this.listado);
            this.listadoPanel = this.listado;
            this.loadingController.dismiss();
          });
      });
  }

  /* Componente Refresher de IONIC v4. Refresca los datos */
  doRefresh(refresher) {
    this.todoServ.leeDatos()
      .subscribe((querySnapshot) => {
        this.listado = [];
        querySnapshot.forEach((doc) => {
          this.listado.push({ id: doc.id, ...doc.data(), contLikes: 0});
        });
        console.log(this.listado);
        this.listadoPanel = this.listado;

        // Hemos terminado de cargar todas las imágenes , ahora los likes
        this.todoServ.leeLikesOrdenados()
          .then((querySnapshot) => {
            querySnapshot.forEach((docu) => {
              // Busco en this.listado lo que tengan el mismo doc.id y añado countLikes
              let indexe = this.listado.find(index => index.id === docu.id);
              indexe.contLikes = docu.data().contLikes;
            });
            // He terminado de cargar los likes
            console.log(this.listado);
            this.listadoPanel = this.listado;
            refresher.target.complete();
          });
      });
  }

  /* Se ejecuta cuando la página está a punto de entrar y convertirse en la página activa. */
  ionViewWillEnter() {
    this.category = "0";
    this.SwipedTabsSlider.length().then(l => {
      this.ntabs = l;
    });
  }

  /* Actualiza la categoría que esté en ese momento activa*/
  updateCat(cat: Promise<any>) {
    cat.then(dat => {
      this.category = dat;
      this.category = +this.category;
    });
  }
  
  /* Método que permite actualizar el indicado cuando se cambia de slide*/
  updateIndicatorPosition() {
    this.SwipedTabsSlider.getActiveIndex().then(i => {
      if (this.ntabs > i) {  // this condition is to avoid passing to incorrect index
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (i * 100) + '%,0,0)';
      }
    });
  }
  /* Método que anima la "rayita" mientras nos estamos deslizando por el slide*/
  animateIndicator(e) {
    if (this.SwipedTabsIndicator)
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' +
        ((e.target.swiper.progress * (this.ntabs - 1)) * 100) + '%,0,0)';
  }

  /* Loading */
  async presentLoading(msg) {
    let myloading = await this.loadingController.create({
      message: msg
    });
    return await myloading.present();
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
