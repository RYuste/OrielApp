import { Component,ViewChild} from '@angular/core';
import { IonSlides, LoadingController, AlertController, ModalController,
          ActionSheetController, ToastController, IonInfiniteScroll } from '@ionic/angular';
import { ModelPage } from '../model/model.page';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LocalDBService} from '../servicios/local-db.service';
import { NetworkService } from '../servicios/network.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;
  private listado = [];
  private listadoPanel = [];

  private ishackingme = null;
  private ishackingmeCont = 0;

  private visibleLike = false;
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
              private storage: Storage,
              private localDB: LocalDBService,
              private network: NetworkService,
              public loadingController: LoadingController) { }

  ngOnInit() {
  }

  /* Almacena los 'likes' dados en la imágen */
  meGusta(id) {
    // Si está pulsado el botón 'like', disminuye el contLikes y muestra el botón en OFF
    /*if(this.visibleLike){
      this.visibleLike = !this.visibleLike;
      this.contLikes--;
    }*/


    this.localDB.getLike(id).then((val) => {
      console.log(id);
      console.log(val);

      // Si existe este id en local no hago nada y muestro mensaje
      if (val != null) {
        this.toastShow("Ya has votado esta imágen.");
      } else {
        console.log("NO he votado aún");
        //this.presentLoading(this.translate.instant("cargando"));
        this.todoServ.leeLikes(id).subscribe((datos) => {
          console.log(datos);
          // Si ya existe lo actualiza, sino, lo crea
          if (datos.exists) {
            console.log(datos.data());

            let data = {
              contLikes: +datos.data()['contLikes'] + 1
            };
            // Actualizar el nuevo valor
            this.todoServ.actualizaLikes(id, data)
              .then((docRef) => {
                // Guarda el id en local para saber que ya ha votado
                this.localDB.setLike(id, data);
                // Cerramos el cargando...
                //this.loadingController.dismiss();
              });
          } else {
            let data = {
              contLikes: 1
            };
            // Crear el nuevo valor
            this.todoServ.añadeLikes(id,data).then((docRef) => {
              // Guarda el id en local para saber que ya ha votado
              this.localDB.setLike(id, data);
              // Cerramos el cargando...
              //this.loadingController.dismiss();
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
    if(this.ishackingmeCont>6){
      // Hace visible el boton
      this.visibleBasura = true; 
    }else{
      // Aun no hemos pulsado todas las veces;
      this.ishackingme=setTimeout(()=>{this.ishackingmeCont=0;},
      800);
    }
  }

  /* Muestra una alerta para eliminar una imágen */
  async  eliminarImagen(id){
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
            this.todoServ.borraNota(id);
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
    const modal = await this.modalCtrl.create({
      component: ModelPage
    });
    modal.onDidDismiss();
    await modal.present();
  }

  /* Se ejecuta cuando la página ha entrado completamente y ahora es la página activa. */
  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");

    this.presentLoading(this.translate.instant("cargando"));
    this.todoServ.leeDatos()
      .subscribe((querySnapshot) => {
        this.listado = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          this.listado.push({ id: doc.id, ...doc.data() });
        });
        //console.log(this.listado);
        this.listadoPanel = this.listado;
        this.loadingController.dismiss();
      });
  }

  /* Componente Refresher de IONIC v4. Refresca los datos */
  doRefresh(refresher) {
    this.todoServ.leeDatos()
      .subscribe(querySnapshot => {
        this.listado = [];
        querySnapshot.forEach((doc) => {
          this.listado.push({ id: doc.id, ...doc.data() });
        });
        this.listadoPanel = this.listado;
        refresher.target.complete();
      });
  }

  /* Se ejecuta cuando la página está a punto de entrar y convertirse en la página activa. */
  ionViewWillEnter() {
    this.category = "0";
    this.SwipedTabsSlider.length().then(l => {
      this.ntabs = l;
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
    //console.log(e.target.swiper.progress);
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

  /* Limita el número de imágenes que muestra */
  /*doInfinite(infiniteScroll) {
    setTimeout(() => {
      for (let item = 1; item < 3; item++) {
        this.listado.push(this.listado.length);
      }
      infiniteScroll.complete();
    }, 300);
  }*/
}
