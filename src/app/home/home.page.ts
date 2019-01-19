import { Component,ViewChild} from '@angular/core';
import { IonSlides, IonInfiniteScroll } from '@ionic/angular';

import { ModelPage } from '../model/model.page';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;

  private visible = false;
  private tabs = ["selectTab(0)", "selectTab(1)"];
  private category: any = "0";
  private ntabs = 2;
  private SwipedTabsIndicator: any = null;
  private image: any = null;

  constructor(public modalCtrl: ModalController) { }

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

  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
  }

  ionViewWillEnter() {
    this.category = "0";
    this.SwipedTabsSlider.length().then(l => {  //no sería necesario aquí, solo en ngOnInit
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
}
