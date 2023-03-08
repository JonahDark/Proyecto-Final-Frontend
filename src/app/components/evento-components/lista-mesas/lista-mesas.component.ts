import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Comensal } from 'src/app/models/comensal';
import { Evento } from 'src/app/models/evento';
import { Mesa } from 'src/app/models/mesa';
import { Ubicacion } from 'src/app/models/ubicacion';
import { Usuario } from 'src/app/models/usuario';
import { ComensalService } from 'src/app/services/comensal/comensal.service';
import { EventoService } from 'src/app/services/evento/evento.service';
import { MesaService } from 'src/app/services/mesa/mesa.service';
import { UbicacionService } from 'src/app/services/ubicacion/ubicacion.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-lista-mesas',
  templateUrl: './lista-mesas.component.html',
  styleUrls: ['./lista-mesas.component.scss'],
})
export class ListaMesasComponent implements OnInit {
  rolConfirmacion: any;
  mesas: Mesa[] = [];
  evento!: Evento;
  comensales: Comensal[] = [];
  num_mesas: number = 0;  
  num_comensales_evento: number = 0;  
  es_admin: boolean = false;
  es_edicion: boolean = false;



  constructor(
    private alertController: AlertController,
    private mesaService: MesaService,
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private comensalService: ComensalService,
    private ubicacionService: UbicacionService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.eventoService.es_edicion_evento.subscribe({ next: (es_edicion_evento) => { this.es_edicion = es_edicion_evento } });
    this.eventoService.evento.subscribe({ next: (evento) => { this.evento = evento } });
    this.usuarioService.es_admin.subscribe({ next: (es_admin) => { this.es_admin = es_admin } });


    this.mesaService.getMesasDeEvento(this.evento.id!).subscribe({
      next: (mesas) => {
        this.mesas = mesas
        this.num_mesas = Object.keys(this.mesas).length
      }
    });


    this.comensalService.getComensalesPorEvento(this.evento.id!).subscribe(
      {
        next: (comensales) => {
          this.comensales = comensales;
          this.comensalService.setComensales(this.comensales);
          this.num_comensales_evento = Object.keys(this.comensales).length;
        },
        error: (error) => console.error(`${error}`),
        complete: () => console.info('Listado de comensales por evento completado')
      }
    )
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  borrarMesa(id_mesa: number) {
    this.mesaService.eliminarMesa(id_mesa).subscribe(
      {
        next: () => this.ngOnChanges(),
        error: (error) => console.error(`${error}`),
        complete: () => console.info('BORRADO DE MESA CORRECTAMENTE')
      }
    )
  }

  irAAddMesa() {
    this.mesaService.setEsCrearMesa(true);
    this.router.navigate(['/evento/formMesa'])
  }

  irADetalleMesa(mesa: Mesa) {
    this.mesaService.setMesa(mesa);
    this.router.navigate(['/evento/mesa']);
  }

  irAEditarMesa(mesa: Mesa) {
    this.mesaService.setEsCrearMesa(false);
    this.mesaService.setMesa(mesa);
    this.router.navigate(['/evento/formMesa'])
  }

  irADetallesPago() {
    this.router.navigate(['/evento/detallesPago'])
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
        if (this.es_edicion) {
          this.router.navigate(['/evento/editar-evento']);
        } else {
          
          this.router.navigate(['/home/inicio']);
        }
      }
    }
  }
}
