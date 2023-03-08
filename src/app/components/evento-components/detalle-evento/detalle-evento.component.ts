import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/services/evento/evento.service';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.scss'],
})
export class DetalleEventoComponent implements OnInit {
  evento!: Evento;
  precio_total: number = 0;
  constructor(
    private eventoService: EventoService
  ) { }

  ngOnInit() {
    this.eventoService.evento.subscribe({ next: (evento) => this.evento = evento });
    this.eventoService.precio_total.subscribe({ next: (precio_total) => this.precio_total = precio_total });
  }




}
