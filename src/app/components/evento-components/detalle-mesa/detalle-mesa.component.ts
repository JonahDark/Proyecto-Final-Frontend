import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comensal } from 'src/app/models/comensal';
import { Evento } from 'src/app/models/evento';
import { Mesa } from 'src/app/models/mesa';
import { Ubicacion } from 'src/app/models/ubicacion';
import { ComensalService } from 'src/app/services/comensal/comensal.service';
import { EventoService } from 'src/app/services/evento/evento.service';
import { MesaService } from 'src/app/services/mesa/mesa.service';
import { UbicacionService } from 'src/app/services/ubicacion/ubicacion.service';

@Component({
  selector: 'app-detalle-mesa',
  templateUrl: './detalle-mesa.component.html',
  styleUrls: ['./detalle-mesa.component.scss'],
})
export class DetalleMesaComponent implements OnInit {
  comensales: Comensal[] = [];
  mesa!: Mesa;
  evento!: Evento;  
  num_comensales_mesa: number = 0;
  num_comensales_evento: number = 0;  

  constructor(
    private mesaService: MesaService,
    private router: Router,
    private eventoService: EventoService,
    private comensalService: ComensalService,     
  ) { }

  ngOnInit() {
    this.mesaService.mesa.subscribe(
      {
        next: (mesa) => {
          this.mesa = mesa;
        }
      });   
      this.eventoService.evento.subscribe({ next: (evento) => { this.evento = evento } });      

      this.comensalService.getComensalesPorMesa(this.mesa.id!).subscribe(
        {
          next: (comensales) => {
            this.comensales = comensales;
            this.comensalService.setComensales(this.comensales);
            this.num_comensales_mesa = Object.keys(this.comensales).length;            
          },
          error: (error) => console.error(`${error}`),
          complete: () => console.info('Listado de comensales por mesa completado')
        }
      );

      this.comensalService.getComensalesPorEvento(this.evento.id!).subscribe(
        {
          next: (comensales) => {
            this.comensales = comensales;
            this.comensalService.setComensales(this.comensales);
            this.num_comensales_evento = Object.keys(this.comensales).length;            
          },
          error: (error) => console.error(`${error}`),
          complete: () => console.info('Listado de comensales por mesa completado')
        }
      );
      
  }



  ionViewWillEnter() {
    this.ngOnInit();
  }



  anyadirComensal() {
    this.mesaService.setEsCrearMesa(true);
    this.router.navigate(['/evento/formComensal'])
  }

  verComensales() {
    this.router.navigate(['/evento/comensales']);
  }


}
