import { Component, OnInit } from '@angular/core';
import { Ubicacion } from 'src/app/models/ubicacion';
import { UbicacionService } from 'src/app/services/ubicacion/ubicacion.service';

@Component({
  selector: 'app-detalle-ubicacion',
  templateUrl: './detalle-ubicacion.component.html',
  styleUrls: ['./detalle-ubicacion.component.scss'],
})
export class DetalleUbicacionComponent implements OnInit {
  ubicacion: Ubicacion | undefined;
  constructor(
    private ubicacionService: UbicacionService,    
  ) { }

  ngOnInit() {
    this.ubicacionService.ubicacion.subscribe({ next: (ubicacion) => this.ubicacion = ubicacion });
  }

}
