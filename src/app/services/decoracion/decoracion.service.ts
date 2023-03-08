import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, BehaviorSubject } from 'rxjs';
import { Decoracion } from 'src/app/models/decoracion';
import { EventoService } from '../evento/evento.service';

@Injectable({
  providedIn: 'root'
})
export class DecoracionService {
  url: string = 'http://localhost:8080/api/';

  private decoracion$ = new BehaviorSubject<Decoracion>({});
  decoracion = this.decoracion$.asObservable();

  private es_editar_decoracion$ = new BehaviorSubject<boolean>(false);
  es_editar_decoracion = this.es_editar_decoracion$.asObservable();

  constructor(private http: HttpClient,
    private eventoService: EventoService) { }

  setEsEditarDecoracion(es_editar: boolean) {
    this.es_editar_decoracion$.next(es_editar);
  }

  setDecoracion(decoracion: Decoracion) {
    this.decoracion$.next(decoracion);
  }

  getDecoraciones(): Observable<Decoracion[]> {
    return this.http.get<Decoracion[]>(this.url + 'getAllDecoraciones').pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER LA LISTA DECORACIONES');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  editDecoracion(id_decoracion: number, decoracion: Decoracion): Observable<Decoracion> {
    return this.http.patch<Decoracion>(this.url + 'editDecoracion/' + id_decoracion, decoracion).pipe(
      catchError((err) => {
        console.error('ERROR AL EDITAR LA DECORACIÓN');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }


  createDecoracion(decoracion: Decoracion): Observable<Decoracion> {
    return this.http.post<Decoracion>(this.url + 'createDecoracion', decoracion).pipe(
      catchError((err) => {
        console.error('ERROR AL CREAR LA DECORACIÓN');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  deleteDecoracion(id: number): Observable<unknown> {
    return this.http.delete<Decoracion>(this.url + 'deleteDecoracion/' + id).pipe(
      catchError((err) => {
        console.error('ERROR AL BORRAR LA DECORACIÓN');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }


  getDecoracionesNoEscogidas(decoraciones: Decoracion[]): Observable<Decoracion[]>{
    var decoraciones$ = new BehaviorSubject<Decoracion[]>([{}]);
    this.eventoService.getAllEventos().subscribe(
      {
        next:(eventosResponse)=>{
          for (let i = 0; i < decoraciones.length; i++) {
            const decoracion = decoraciones[i];
            for (let j = 0; j < eventosResponse.length; j++) {
              const eventoResponse = eventosResponse[j];
              if(decoracion.id === eventoResponse.decoracion?.id){
                decoraciones.splice(i, 1);
              }
            }
          }
        }
      });
      decoraciones$.next(decoraciones);
      return decoraciones$.asObservable();
  }

}
