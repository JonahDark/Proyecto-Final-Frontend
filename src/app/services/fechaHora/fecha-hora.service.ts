import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FechaHoraService {

  private fechaSeleccionada$ = new BehaviorSubject<boolean>(false);
  fechaSeleccionada = this.fechaSeleccionada$.asObservable();
  constructor() { }

  setFechaSeleccionada(selecciona:boolean){
    this.fechaSeleccionada$.next(selecciona);
  }
}
