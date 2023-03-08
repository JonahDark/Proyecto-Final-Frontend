import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento';
import { ComensalService } from 'src/app/services/comensal/comensal.service';
import { DecoracionService } from 'src/app/services/decoracion/decoracion.service';
import { EventoService } from 'src/app/services/evento/evento.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UbicacionService } from 'src/app/services/ubicacion/ubicacion.service';
import { MesaService } from 'src/app/services/mesa/mesa.service';
import { Router } from '@angular/router';
import { Ubicacion } from 'src/app/models/ubicacion';
import { Menu } from 'src/app/models/menu';
import { Decoracion } from 'src/app/models/decoracion';
import { Comensal } from 'src/app/models/comensal';
import { Mesa } from 'src/app/models/mesa';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detalles-pago',
  templateUrl: './detalles-pago.component.html',
  styleUrls: ['./detalles-pago.component.scss'],
})
export class DetallesPagoComponent implements OnInit {

  evento!: Evento;
  ubicacion!: Ubicacion;
  menu!: Menu;
  decoracion!: Decoracion;
  comensales: Comensal[] = [];
  comensales_normales: Comensal[] = [];
  comensales_alergenos: Comensal[] = [];
  comensales_infantiles: Comensal[] = [];
  comensales_alergenos_infantiles: Comensal[] = [];
  mesas: Mesa[] = [];

  num_menu_normales: number = 0;
  num_menu_alergenos: number = 0;
  num_menu_infantiles: number = 0;
  num_menu_alergenos_infantiles: number = 0;

  precio_total_decoracion: number = 0;
  precio_total_menu_normal: number = 0;
  precio_total_menu_alergeno: number = 0;
  precio_total_menu_infantil: number = 0;
  precio_total_menu_alergeno_infantil: number = 0;
  precio_total_menu: number = 0;

  precio_total_evento: number = 0;

  num_mesas: number = 0;

  esEdicion: boolean = false;

  constructor(
    private eventoService: EventoService,
    private decoracionService: DecoracionService,
    private menuService: MenuService,
    private ubicacionService: UbicacionService,
    private comensalService: ComensalService,
    private mesaService: MesaService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.eventoService.es_edicion_evento.subscribe({ next: (esEdicion) => this.esEdicion = esEdicion });

    if (this.esEdicion) {
      this.eventoService.evento.subscribe({ next: (evento) => this.evento = evento });
      this.decoracion = this.evento.decoracion!
      this.mesaService.getMesasDeEvento(this.evento.id!).subscribe({
        next: (mesas) => {
          this.mesas = mesas
          this.num_mesas = Object.keys(this.mesas).length
          this.precio_total_decoracion = this.decoracion.precio! * this.num_mesas;
        }
      });

      this.ubicacion = this.evento.ubicacion!;
      this.menu = this.evento.menu!;

      this.comensalService.getComensalesPorEvento(this.evento.id!).subscribe({
        next: (comensales) => {
          this.comensales = comensales
          for (let i = 0; i < this.comensales.length; i++) {
            const comensal = this.comensales[i];
            if (comensal.alergeno && comensal.infantil) {
              this.comensales_alergenos_infantiles.push(comensal);
            }
            if (!comensal.alergeno && comensal.infantil) {
              this.comensales_infantiles.push(comensal);
            }
            if (comensal.alergeno && !comensal.infantil) {
              this.comensales_alergenos.push(comensal);
            }
            if (!comensal.alergeno && !comensal.infantil) {
              this.comensales_normales.push(comensal);
            }
          }
          this.num_menu_normales = Object.keys(this.comensales_normales).length;
          console.log(this.num_menu_normales)
          this.num_menu_alergenos = Object.keys(this.comensales_alergenos).length;
          console.log(this.num_menu_alergenos)
          this.num_menu_infantiles = Object.keys(this.comensales_infantiles).length;
          console.log(this.num_menu_infantiles)
          this.num_menu_alergenos_infantiles = Object.keys(this.comensales_alergenos_infantiles).length;
          console.log(this.num_menu_alergenos_infantiles)


          this.precio_total_menu_normal = this.num_menu_normales * this.menu.precio_menu!;
          this.precio_total_menu_alergeno = this.num_menu_alergenos * (this.menu.precio_menu! - 5);
          this.precio_total_menu_infantil = this.num_menu_infantiles * (this.menu.precio_menu! - 10);
          this.precio_total_menu_alergeno_infantil = this.num_menu_alergenos_infantiles * (this.menu.precio_menu! - 15);
          this.precio_total_menu = this.precio_total_menu_normal + this.precio_total_menu_alergeno + this.precio_total_menu_infantil + this.precio_total_menu_alergeno_infantil;
          this.precio_total_evento = this.precio_total_decoracion + this.precio_total_menu + this.ubicacion.precio!
        }
      });
      this.eventoService.setPrecioTotal(this.precio_total_evento);
    } else {
      this.eventoService.evento.subscribe({ next: (evento) => { this.evento = evento } });
      this.decoracionService.decoracion.subscribe({ next: (decoracion) => { this.decoracion = decoracion } });

      this.mesaService.getMesasDeEvento(this.evento.id!).subscribe({
        next: (mesas) => {
          this.mesas = mesas
          this.num_mesas = Object.keys(this.mesas).length
          this.precio_total_decoracion = this.decoracion.precio! * this.num_mesas;
        }
      });

      this.ubicacionService.ubicacion.subscribe({ next: (ubicacion) => { this.ubicacion = ubicacion } });
      this.menuService.menu.subscribe({ next: (menu) => { this.menu = menu } });

      this.comensalService.getComensalesPorEvento(this.evento.id!).subscribe({
        next: (comensales) => {
          this.comensales = comensales
          for (let i = 0; i < this.comensales.length; i++) {
            const comensal = this.comensales[i];
            if (comensal.alergeno && comensal.infantil) {
              this.comensales_alergenos_infantiles.push(comensal);
            }
            if (!comensal.alergeno && comensal.infantil) {
              this.comensales_infantiles.push(comensal);
            }
            if (comensal.alergeno && !comensal.infantil) {
              this.comensales_alergenos.push(comensal);
            }
            if (!comensal.alergeno && !comensal.infantil) {
              this.comensales_normales.push(comensal);
            }
          }
          this.num_menu_normales = Object.keys(this.comensales_normales).length;
          console.log(this.num_menu_normales)
          this.num_menu_alergenos = Object.keys(this.comensales_alergenos).length;
          console.log(this.num_menu_alergenos)
          this.num_menu_infantiles = Object.keys(this.comensales_infantiles).length;
          console.log(this.num_menu_infantiles)
          this.num_menu_alergenos_infantiles = Object.keys(this.comensales_alergenos_infantiles).length;
          console.log(this.num_menu_alergenos_infantiles)


          this.precio_total_menu_normal = this.num_menu_normales * this.menu.precio_menu!;
          this.precio_total_menu_alergeno = this.num_menu_alergenos * (this.menu.precio_menu_alergeno!);
          this.precio_total_menu_infantil = this.num_menu_infantiles * (this.menu.precio_menu_infantil!);
          this.precio_total_menu_alergeno_infantil = this.num_menu_alergenos_infantiles * (this.menu.precio_menu_alergeno_infantil!);
          this.precio_total_menu = this.precio_total_menu_normal + this.precio_total_menu_alergeno + this.precio_total_menu_infantil + this.precio_total_menu_alergeno_infantil;
          this.precio_total_evento = this.precio_total_decoracion + this.precio_total_menu + this.ubicacion.precio!
        }
      });
      this.eventoService.setPrecioTotal(this.precio_total_evento);
    }
  }

  realizarPago(precio_total_evento: number) {
    this.eventoService.evento.subscribe({
      next: (evento) => {
        this.evento = evento
        this.evento.precio_total = precio_total_evento;
        this.evento.pago_confirmado = false;
        this.avisoConfirmacion();
      },
      error: () => this.errorToast("No ha sido posible realizar el pago"),
      complete: () => console.info("confirmacion completada")

    });




    this.eventoService.updateEvento(this.evento, this.evento.id!).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.eventoService.setEvento(this.evento);
        this.router.navigate(['/home/inicio'])
      }
    })
  }

  async avisoConfirmacion() {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: 'Confirmación necesaria',
      message: 'En 24 horas le notificaremos la confirmación del pago',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
  async successToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'middle',
      color: 'success'
    });
    await toast.present();
  }


  async errorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'middle',
      color: 'danger'
    });
    await toast.present();
  }
}
