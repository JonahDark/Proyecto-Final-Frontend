import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/services/evento/evento.service';

@Component({
  selector: 'app-tipo-evento',
  templateUrl: './tipo-evento.component.html',
  styleUrls: ['./tipo-evento.component.scss'],
})
export class TipoEventoComponent implements OnInit {
  esEdicionEvento: boolean = false;
  evento!: Evento;
  constructor(
    private router: Router,
    private eventoService: EventoService,
  ) { }

  ngOnInit() {
    this.eventoService.es_edicion_evento.subscribe({ next: (esEdicion) => this.esEdicionEvento = esEdicion });
  }

  elegirTipo(tipo: string) {
    if (this.esEdicionEvento) {
      this.eventoService.evento.subscribe({ next: (evento) => this.evento = evento });       
      this.evento.tipo = tipo;
      this.eventoService.updateEvento(this.evento, this.evento.id!).subscribe({ next: (evento) => this.eventoService.setEvento(evento) });
      this.router.navigate(['/evento/editar-evento'])
    } else {
      this.eventoService.setTipo(tipo);
      this.router.navigate(['/evento/nombre']);
    }
  }
}
