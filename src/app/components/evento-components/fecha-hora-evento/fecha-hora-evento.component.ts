import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from 'src/app/models/evento';
import { Usuario } from 'src/app/models/usuario';
import { format, parseISO, getDate, getMonth, getYear } from 'date-fns';
import { EventoService } from 'src/app/services/evento/evento.service';
import { FechaHoraService } from 'src/app/services/fechaHora/fecha-hora.service';

@Component({
  selector: 'app-fecha-hora-evento',
  templateUrl: './fecha-hora-evento.component.html',
  styleUrls: ['./fecha-hora-evento.component.scss'],
})
export class FechaHoraEventoComponent implements OnInit {
  tipo: string | undefined;
  fecha!: Date;
  fechaString: string | undefined;
  esEdicion: boolean = false;
  evento!: Evento;
  selecciona: boolean = false;
  horario: string = '';


  constructor(
    private router: Router,
    private eventoService: EventoService,
    private fechaService: FechaHoraService
  ) { }

  ngOnInit() {
    this.eventoService.es_edicion_evento.subscribe({ next: (esEdicion) => this.esEdicion = esEdicion });
    this.fechaService.fechaSeleccionada.subscribe({ next: (selecciona) => this.selecciona = selecciona });
  }

  showdate() {
    if (this.esEdicion) {
      const currDate = Date.now();
      const dt = new Date(currDate);
      const mydate = new Date(this.fecha);
      if (dt.getDate() > mydate.getDate()) {
        this.selecciona = false
      } else {
        this.selecciona = true;
        this.fechaString = format(parseISO(this.fecha!.toString()), 'dd-MM-yyyy');
        this.eventoService.evento.subscribe({ next: (evento) => this.evento = evento });
        this.evento.fecha = this.fechaString;
        this.eventoService.updateEvento(this.evento, this.evento.id!).subscribe({
          next: (evento) => {
            this.eventoService.setEvento(evento);
            this.router.navigate(['/evento/editar-evento'])
          }
        });
      }
    } else {
      const currDate = Date.now();
      const dt = new Date(currDate);
      const mydate = new Date(this.fecha);
      if (dt.getDate() > mydate.getDate()) {
        this.selecciona = false
      } else {
        this.selecciona = true;
        this.fechaString = format(parseISO(this.fecha!.toString()), 'dd-MM-yyyy');
        this.eventoService.setFecha(this.fechaString); 
        this.eventoService.setHorario(this.horario);
      }
    }
  }

  seleccionarFecha() {
    this.eventoService.setHorario(this.horario);
    this.router.navigate(['/evento/menuUbicacion']);
  }

}
