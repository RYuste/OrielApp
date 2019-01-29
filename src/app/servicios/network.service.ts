import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private isConnected;
  private disconnect;
  private connect;

  constructor(private network: Network,
    private toastCtrl: ToastController) { }


  /* Comprueba si hay conexión */
  sinConexión() {
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected!');

      this.isConnected = false;
      this.toastShow("No tienes conexión. Vuelve a intentarlo más tarde.");
    });
  }

  /* Mensaje informativo con "toast" */
  async toastShow(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 6000
    });
    toast.present();
  }
}
