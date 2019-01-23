import { Component,ViewChild} from '@angular/core';
import { IonSlides, LoadingController, AlertController, IonInfiniteScroll } from '@ionic/angular';

import { ModelPage } from '../model/model.page';
import { ModalController, NavParams } from '@ionic/angular';
import { TodoservicioService } from '../servicios/todoservicio.service';

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

  private visible = false;
  private visibleBasura = false;
  private cont = 0;

  private tabs = ["selectTab(0)", "selectTab(1)"];
  private category: any = "0";
  private ntabs = 2;
  private SwipedTabsIndicator: any = null;
  //private image: any = null;

  constructor(public modalCtrl: ModalController,
              private todoS: TodoservicioService,
              private alertCtrl: AlertController,
              public loadingController: LoadingController) { }

  ngOnInit() {
  }

  /* Oculta o revela el botón de eliminarImagen */
  deleteCards(){
    clearTimeout(this.ishackingme);
    this.ishackingmeCont++;
    if(this.ishackingmeCont>6){
      // Hace visible el boton
      this.visibleBasura = true; 
    }else{
      // Aun no hemos pulsado todas las veces;
      this.ishackingme=setTimeout(()=>{this.ishackingmeCont=0;},
      1000);
    }
  }

  /* Muestra una alerta para eliminar una imágen */
  async  eliminarImagen(id){
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Imágen',
      message: '¿Deseas eliminar esta imágen?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            console.log('Delete Okay');
            this.todoS.borraNota(id);
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

  meGusta(){
    this.visible = !this.visible; 
  }

  /* Se ejecuta cuando la página ha entrado completamente y ahora es la página activa. */
  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");

    this.presentLoading("Cargando...");
    this.todoS.leeDatos()
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
    this.todoS.leeDatos()
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
