import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Decoracion } from 'src/app/models/decoracion';
import { Evento } from 'src/app/models/evento';
import { DecoracionService } from 'src/app/services/decoracion/decoracion.service';
import { EventoService } from 'src/app/services/evento/evento.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-lista-decoracion',
  templateUrl: './lista-decoracion.component.html',
  styleUrls: ['./lista-decoracion.component.scss'],
})
export class ListaDecoracionComponent implements OnInit {
  decoraciones: Decoracion[] = [];
  num_decoraciones: number = 0;
  es_admin: boolean = false;
  es_edicion_evento: boolean = false;
  es_crear_evento: boolean = false;
  evento!: Evento;
  constructor(
    private decoracionService: DecoracionService,
    private usuarioService: UsuarioService,
    private eventoService: EventoService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.decoracionService.getDecoraciones().subscribe({
      next: (decoraciones) => {
        this.decoraciones = decoraciones;
        this.num_decoraciones = Object.keys(this.decoraciones).length
        if (this.es_edicion_evento) {
          this.decoracionService
            .getDecoracionesNoEscogidas(this.decoraciones)
            .subscribe({
              next: (decoraciones) => {
                this.decoraciones = decoraciones; 
                this.num_decoraciones = Object.keys(this.decoraciones).length               
              },
              error: (error) => console.error(`${error}`),
              complete: () =>
                console.info('Petición de lista de decoraciones terminada'),
            });
        }
      },
    });
    this.eventoService.es_edicion_evento.subscribe({
      next: (es_edicion_evento) => (this.es_edicion_evento = es_edicion_evento),
    });
    this.usuarioService.es_crear_evento.subscribe({
      next: (es_crear_evento) => (this.es_crear_evento = es_crear_evento),
    });
    this.usuarioService.es_admin.subscribe({
      next: (es_admin) => (this.es_admin = es_admin),
    });
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  elegirDecoracion(decoracion: Decoracion) {
    if (this.es_edicion_evento) {
      this.eventoService.evento.subscribe({
        next: (evento) => (this.evento = evento),
      });
      this.evento.decoracion = decoracion;
      this.eventoService
        .updateEvento(this.evento, this.evento.id!)
        .subscribe({ next: (evento) => this.eventoService.setEvento(evento) });
      this.router.navigate(['/evento/editar-evento']);
    } else {
      this.decoracionService.setDecoracion(decoracion);
      let id_decoracion = decoracion.id!;
      this.eventoService.setIdDecoracion(id_decoracion);
      this.router.navigate(['/evento/menus']);
    }
  }

  irAEditarDecoracion(decoracion: Decoracion) {
    this.decoracionService.setEsEditarDecoracion(true);
    this.decoracionService.setDecoracion(decoracion);
    this.router.navigate(['/admin/form-decoracion']);
  }

  irAAddDecoracion() {
    this.decoracionService.setEsEditarDecoracion(false);
    this.router.navigate(['/admin/form-decoracion']);
  }

  borrarDecoracion(id_decoracion: number) {
    this.decoracionService.deleteDecoracion(id_decoracion).subscribe({
      next: () => this.ngOnChanges(),
      error: (error) =>
        this.errorToast('ERROR: No se ha podido borrar la decoración'),
      complete: () => this.successToast('Decoración borrada correctamente'),
    });
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
