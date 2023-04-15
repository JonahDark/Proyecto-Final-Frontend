import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastButton, ToastController } from '@ionic/angular';
import { Evento } from 'src/app/models/evento';
import { Usuario } from 'src/app/models/usuario';
import { EventoService } from 'src/app/services/evento/evento.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.component.html',
  styleUrls: ['./lista-eventos.component.scss'],
})
export class ListaEventosComponent implements OnInit {
  usuario!: Usuario;
  admin!: Usuario;
  eventos: Evento[] = [];
  num_eventos: number = 0;
  pago_confirmado: Boolean = false;
  es_admin: Boolean = false;
  evento!: Evento;
  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.usuarioService.es_admin.subscribe({
      next: (es_admin) => (this.es_admin = es_admin),
    });

    if (this.es_admin) {
      this.usuarioService.admin.subscribe({
        next: (admin) => {
          this.admin = admin;
          this.eventoService
            .getAllEventos()
            .subscribe({ next: (eventos) => (this.eventos = eventos) });
        },
      });
    } else {
      this.usuarioService.usuario.subscribe({
        next: (usuario) => {
          this.usuario = usuario;          
          this.eventoService.getEventosDeUsuario(this.usuario.id!).subscribe({
            next: (eventos) => {
              this.eventos = eventos;
              this.num_eventos = Object.keys(this.eventos).length
            },
          });
        },
      });
    }
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  irADetallesEvento(evento: Evento) {
    this.eventoService.setEvento(evento);
    this.router.navigate(['/evento/evento']);
  }

  cambiaEstado() {
    this.pago_confirmado = !this.pago_confirmado;
  }

  eliminarEvento(id_evento: number) {
    this.eventoService.eliminarEvento(id_evento).subscribe({
      next: () => this.ngOnChanges(),
      error: (error) => console.error(`${error}`),
      complete: () => console.info('BORRADO DE MESA CORRECTAMENTE'),
    });
  }

  editarEvento(evento: Evento) {
    this.eventoService.setEsEdicionEvento(true);
    this.usuarioService.setEsCrearEvento(false);
    this.eventoService.setEvento(evento);
    this.router.navigate(['/evento/editar-evento']);
  }

  AceptarPago(evento: Evento) {
    this.evento = evento;
    this.evento.pago_confirmado = true;
    this.eventoService.updateEvento(this.evento, this.evento.id!).subscribe({
      next: () => {},
      error: () => this.errorToast('Error al realizar el pago'),
      complete: () => this.successToast('Pago aceptado correctamente'),
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
