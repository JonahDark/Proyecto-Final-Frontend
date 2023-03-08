import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/services/evento/evento.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.scss'],
})
export class EditarEventoComponent implements OnInit {
  evento!: Evento;
  es_admin: boolean = false;
  es_edicion_evento:boolean = false;

  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.eventoService.es_edicion_evento.subscribe({ next: (es_edicion_evento) => this.es_edicion_evento = es_edicion_evento });
    this.eventoService.evento.subscribe({ next: (evento) => this.evento = evento });
    this.usuarioService.es_admin.subscribe({ next: (es_admin) => this.es_admin = es_admin });
  }

  editarTipo() {
    this.router.navigate(['/evento/tipo'])
  }

  editarNombre() {
    this.router.navigate(['/evento/nombre'])
  }

  editarFechaHora() {
    this.router.navigate(['/evento/fechaHora'])
  }

  editarUbicacion() {
    this.router.navigate(['/evento/menuUbicacion'])
  }

  editarDecoracion() {
    this.router.navigate(['/evento/decoraciones'])
  }

  editarMenu() {
    this.router.navigate(['/evento/menus'])
  }

  editarComensalesMesas() {
    this.router.navigate(['/evento/mesas'])
  }

}
