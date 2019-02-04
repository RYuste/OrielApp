import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TodoservicioService } from '../servicios/todoservicio.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private isConnected;
  private disconnect;
  private connect;

  constructor(private network: Network,
    private toastCtrl: ToastController,
    private todoServ: TodoservicioService,
    private translate: TranslateService) { 
      /* Comprueba si hay conexión */
      this.disconnect = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected!');
        this.isConnected = false;
        this.todoServ.isConnected = this.isConnected;
        this.toastShow(this.translate.instant("conexionOFF"));
      });
      this.connect = this.network.onConnect().subscribe(() => {
        console.log('network connected!');
          if (this.isConnected == false) {
            this.isConnected = true;
            this.todoServ.isConnected = this.isConnected;
            this.toastShow(this.translate.instant("conexionON"));
          }
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
