import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Comensal } from 'src/app/models/comensal';
import { Mesa } from 'src/app/models/mesa';
import { ComensalService } from 'src/app/services/comensal/comensal.service';
import { MesaService } from 'src/app/services/mesa/mesa.service';

@Component({
  selector: 'app-lista-comensales',
  templateUrl: './lista-comensales.component.html',
  styleUrls: ['./lista-comensales.component.scss'],
})
export class ListaComensalesComponent implements OnInit {

  comensales!: Comensal[];
  num_comensales: number =0;
  mesa!: Mesa;
  rolConfirmacion: any;

  constructor(
    private comensalService: ComensalService,
    private mesaService: MesaService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.mesaService.mesa.subscribe({ next: (mesa) => this.mesa = mesa });  
    this.comensalService.getComensalesPorMesa(this.mesa.id!).subscribe(
      {
        next: (comensales) => {
          this.comensales = comensales;   
                 
          this.comensalService.setComensales(this.comensales);          
        },
        error: (error) => console.error(`${error}`),
        complete: () => console.info('Listado de comensales por mesa completado')
      }
    ); 
  }

  ionViewWillEnter(){
    this.ngOnInit();
  }

  ngOnChanges() {
    this.ngOnInit();
  }


  borrarComensal(id_comensal: number) {
    this.comensalService.eliminarComensal(id_comensal).subscribe(
      {
        next: () => this.ngOnChanges(),
        error: () => console.error('No se ha podido borrar el comensal'),
        complete: () => console.info('Eliminación de comensal completada')
      }
    )
  }

  irAEditarComensal(comensal: Comensal) {
    this.comensalService.setComensal(comensal);
    this.mesaService.setEsCrearMesa(false);
    this.router.navigate(['/evento/formComensal']);
  }


  async mostrarAlerta() {
    const alert = await this.alertController.create(
      {
        header: '¿Esta seguro?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Aceptar',
            role: 'confirm'
          }
        ]
      });
    await alert.present();
    this.rolConfirmacion = await alert.onDidDismiss();
    if (this.rolConfirmacion) {
      if (this.rolConfirmacion.role === 'confirm') {
        this.router.navigate(['/evento/mesa']);
      }
    }
  };
}
