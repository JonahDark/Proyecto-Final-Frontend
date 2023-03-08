import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Evento } from 'src/app/models/evento';
import { Ubicacion } from 'src/app/models/ubicacion';
import { ComensalService } from '../comensal/comensal.service';
import { EventoService } from '../evento/evento.service';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  url: string = 'http://localhost:8080/api/';

  private tipo$ = new BehaviorSubject<string>('');
  tipo = this.tipo$.asObservable();

  private ubicacion$ = new BehaviorSubject<Ubicacion>({});
  ubicacion = this.ubicacion$.asObservable();

  private es_editar_ubicacion$ = new BehaviorSubject<boolean>(false);
  es_editar_ubicacion = this.es_editar_ubicacion$.asObservable();

  constructor(
    private http: HttpClient,
    private eventoService: EventoService,
    private comensalService: ComensalService
  ) { }

  setEsEditarUbicacion(es_editar: boolean) {
    this.es_editar_ubicacion$.next(es_editar);
  }

  setTipo(tipo: string) {
    this.tipo$.next(tipo);
  }

  setUbicacion(ubicacion: Ubicacion) {
    this.ubicacion$.next(ubicacion);
  }

  getUbicaciones(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.url + 'getAllUbicaciones').pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER LA LISTA UBICACIONES');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  getUbicacion(id: number): Observable<Ubicacion> {
    return this.http.get<Ubicacion>(this.url + 'getUbicacion/' + id).pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER EL UBICACION');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }


  getUbicacionesPorTipo(tipo: string): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.url + 'getUbicacionesPorTipo/' + tipo).pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER EL LISTADO DE UBICACIONES');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  editUbicacion(id_ubicacion: number, ubicacion: Ubicacion): Observable<Ubicacion> {
    return this.http.patch<Ubicacion>(this.url + 'editUbicacion/' + id_ubicacion, ubicacion).pipe(
      catchError((err) => {
        console.error('ERROR AL EDITAR LA UBICACIÓN');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }


  createUbicacion(ubicacion: Ubicacion): Observable<Ubicacion> {
    return this.http.post<Ubicacion>(this.url + 'createUbicacion', ubicacion).pipe(
      catchError((err) => {
        console.error('ERROR AL CREAR LA UBICACIÓN');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  deleteUbicacion(id: number): Observable<unknown> {
    return this.http.delete<Ubicacion>(this.url + 'deleteUbicacion/' + id).pipe(
      catchError((err) => {
        console.error('ERROR AL BORRAR LA UBICACIÓN');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  getUbicacionesAforoPermitido(ubicaciones: Ubicacion[], evento: Evento): Observable<Ubicacion[]> {
    var ubicaciones$ = new BehaviorSubject<Ubicacion[]>([{}]);
    this.comensalService.getComensalesPorEvento(evento.id!).subscribe(
      {
        next: (comensales) => {
          var num_comensales = Object.keys(comensales).length
          for (let i = 0; i < ubicaciones.length; i++) {
            const ubicacion = ubicaciones[i];

            if (num_comensales > ubicacion.aforo!) {
              ubicaciones.splice(i, 1);
            }
          }
        }
      });
    ubicaciones$.next(ubicaciones);
    return ubicaciones$.asObservable();
  }

  getUbicacionesNoFechaYHorario(ubicaciones: Ubicacion[], fecha: string, horario: string): Observable<Ubicacion[]> {
    var ubicaciones$ = new BehaviorSubject<Ubicacion[]>([{}]);
    this.eventoService.getAllEventos().subscribe({
      next: (eventos) => {

        for (let i = 0; i < eventos.length; i++) {
          const evento = eventos[i];
          for (let j = 0; j < ubicaciones.length; j++) {
            const ubicacion = ubicaciones[j];
            if (evento.fecha === fecha && evento.horario === horario && evento.ubicacion!.id === ubicacion.id) {
              ubicaciones.splice(j, 1);
            }
          }
        }
      }
    });
    ubicaciones$.next(ubicaciones);
    return ubicaciones$.asObservable();
  }

}
