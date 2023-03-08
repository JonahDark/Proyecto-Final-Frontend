import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/services/evento/evento.service';
import { UbicacionService } from 'src/app/services/ubicacion/ubicacion.service';

@Component({
  selector: 'app-menu-ubicacion',
  templateUrl: './menu-ubicacion.component.html',
  styleUrls: ['./menu-ubicacion.component.scss'],
})
export class MenuUbicacionComponent implements OnInit {
  esEdicion: boolean = false;
  constructor(
    private eventoService: EventoService,
    private router: Router,
    private ubicacionService: UbicacionService
  ) { }
  ngOnInit() {
    this.eventoService.es_edicion_evento.subscribe({ next: (esEdicion) => this.esEdicion = esEdicion });      
  }

  irASalas() {
    this.ubicacionService.setTipo("sala");
    this.router.navigate(['/evento/ubicaciones/salas']);
  }

  irAJardines() {
    this.ubicacionService.setTipo("jardin");
    this.router.navigate(['/evento/ubicaciones/jardines']);
  }
}

