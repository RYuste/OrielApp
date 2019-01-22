import { Component,ViewChild} from '@angular/core';
import { IonSlides, LoadingController, IonInfiniteScroll } from '@ionic/angular';

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

  private visible = false;
  private tabs = ["selectTab(0)", "selectTab(1)"];
  private category: any = "0";
  private ntabs = 2;
  private SwipedTabsIndicator: any = null;
  //private image: any = null;

  constructor(public modalCtrl: ModalController,
              private todoS: TodoservicioService,
              public loadingController: LoadingController) { }

  ngOnInit() {
  }

  // Abre un modal para añadir una imágen
  async abrirModel(){
    const modal = await this.modalCtrl.create({
      component: ModelPage
    });
    // Al cerrar el modal actualiza el listado
    modal.onDidDismiss().then(
      () => {
        this.ionViewDidEnter();
      }
    )
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
  
  /* El método que permite actualizar el indicado cuando se cambia de slide*/
  updateIndicatorPosition() {
    this.SwipedTabsSlider.getActiveIndex().then(i => {
      if (this.ntabs > i) {  // this condition is to avoid passing to incorrect index
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (i * 100) + '%,0,0)';
      }
    });
  }
  /* El método que anima la "rayita" mientras nos estamos deslizando por el slide*/
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
}
