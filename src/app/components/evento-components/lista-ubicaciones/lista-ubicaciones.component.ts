import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from 'src/app/models/evento';
import { Ubicacion } from 'src/app/models/ubicacion';
import { EventoService } from 'src/app/services/evento/evento.service';
import { UbicacionService } from 'src/app/services/ubicacion/ubicacion.service';
import { ComensalService } from 'src/app/services/comensal/comensal.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-lista-ubicaciones',
  templateUrl: './lista-ubicaciones.component.html',
  styleUrls: ['./lista-ubicaciones.component.scss'],
})
export class ListaUbicacionesComponent implements OnInit {
  eventos!: Evento[];
  ubicacionesTipo!: Ubicacion[];
  ubicaciones!: Ubicacion[];
  ubicacionesNoFechaYHorario!: Ubicacion[];
  tipo: string = '';
  precioTotal: number = 0;
  num_ubicaciones: number = 0;
  es_edicion_evento: boolean = false;
  es_admin: boolean = false;
  es_crear_evento: boolean = false;
  evento!: Evento;
  fecha: string = '';
  horario: string = '';

  constructor(
    private ubicacionService: UbicacionService,
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.ubicacionService.tipo.subscribe({
      next: (tipo) => (this.tipo = tipo),
    });
    this.usuarioService.es_crear_evento.subscribe({
      next: (es_crear_evento) => (this.es_crear_evento = es_crear_evento),
    });
    this.eventoService.es_edicion_evento.subscribe({
      next: (es_edicion_evento) => (this.es_edicion_evento = es_edicion_evento),
    });
    this.eventoService.fecha.subscribe({
      next: (fecha) => (this.fecha = fecha),
    });
    this.eventoService.horario.subscribe({
      next: (horario) => (this.horario = horario),
    });
    this.eventoService.evento.subscribe({
      next: (evento) => (this.evento = evento),
    });
    this.usuarioService.es_admin.subscribe({
      next: (es_admin) => (this.es_admin = es_admin),
    });

    if (this.es_admin && !this.es_crear_evento && !this.es_edicion_evento) {
      this.ubicacionService.getUbicaciones().subscribe({
        next: (ubicaciones) => {
          this.ubicaciones = ubicaciones;
          this.num_ubicaciones = Object.keys(this.ubicaciones).length;
        },
      });
    }

    if (this.es_crear_evento) {
      this.ubicacionService.getUbicacionesPorTipo(this.tipo).subscribe({
        next: (ubicacionesTipo) => {
          this.ubicacionesTipo = ubicacionesTipo;
          this.ubicacionService
            .getUbicacionesNoFechaYHorario(
              this.ubicacionesTipo,
              this.fecha,
              this.horario
            )
            .subscribe({
              next: (ubicaciones) => {
                this.ubicacionesTipo = ubicaciones;
                this.num_ubicaciones = Object.keys(this.ubicacionesTipo).length
              },
            });
        },
        error: () => this.errorToast('No existen ubicaciones de este tipo'),
        complete: () => console.log('Listado de ubicaciones completada'),
      });
    }

    if (this.es_edicion_evento) {
      this.ubicacionService.getUbicacionesPorTipo(this.tipo).subscribe({
        next: (ubicacionesTipo) => {
          this.ubicacionesTipo = ubicacionesTipo;
          this.ubicacionService
            .getUbicacionesAforoPermitido(this.ubicacionesTipo, this.evento)
            .subscribe({
              next: (ubicaciones) => {
                this.ubicacionesTipo = ubicaciones;
                this.ubicacionService
                  .getUbicacionesNoFechaYHorario(
                    this.ubicacionesTipo,
                    this.evento.fecha!,
                    this.evento.horario!
                  )
                  .subscribe({
                    next: (ubicaciones) => {
                      this.ubicacionesTipo = ubicaciones;
                      this.num_ubicaciones = Object.keys(this.ubicacionesTipo).length
                    },
                  });
              },
            });

          if (!this.ubicaciones) {
            this.ubicaciones = this.ubicacionesTipo;
          }
        },
        error: (error) => console.error(`${error}`),
        complete: () => console.info('Listado de ubicaciones completada'),
      });
    }
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  irAEditarUbicacion(ubicacion: Ubicacion) {
    this.ubicacionService.setEsEditarUbicacion(true);
    this.ubicacionService.setUbicacion(ubicacion);
    this.router.navigate(['/admin/form-ubicacion']);
  }

  irAAddUbicacion() {
    this.ubicacionService.setEsEditarUbicacion(false);
    this.router.navigate(['/admin/form-ubicacion']);
  }

  borrarUbicacion(id_ubicacion: number) {
    this.ubicacionService.deleteUbicacion(id_ubicacion).subscribe({
      next: () => this.ngOnChanges(),
      error: (error) => console.error(`${error}`),
      complete: () => console.info('Borrado de ubicación completado'),
    });
  }

  verUbicacion(ubicacion: Ubicacion) {
    this.ubicacionService.setUbicacion(ubicacion);
    this.router.navigate(['/evento/ubicacion/' + ubicacion.tipo]);
  }

  elegirUbicacion(ubicacion: Ubicacion) {
    if (this.es_edicion_evento) {
      this.eventoService.evento.subscribe({
        next: (evento) => (this.evento = evento),
      });
      this.evento.ubicacion = ubicacion;
      this.eventoService
        .updateEvento(this.evento, this.evento.id!)
        .subscribe({ next: (evento) => this.eventoService.setEvento(evento) });
      this.ubicacionService.setUbicacion(ubicacion);
      this.router.navigate(['/evento/editar-evento']);
    } else {
      this.eventoService.setIdUbicacion(ubicacion.id!);
      this.ubicacionService.setUbicacion(ubicacion);
      this.router.navigate(['/evento/decoraciones']);
    }
  }

  async successToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'middle',
      color: 'success',
    });
    await toast.present();
  }

  async errorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'middle',
      color: 'danger',
    });
    await toast.present();
  }
}
