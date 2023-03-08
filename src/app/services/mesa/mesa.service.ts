import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, BehaviorSubject } from 'rxjs';
import { Mesa } from 'src/app/models/mesa';


@Injectable({
  providedIn: 'root'
})

export class MesaService {
  url: string = 'http://localhost:8080/api/';

  private mesa$ = new BehaviorSubject<Mesa>({});
  mesa = this.mesa$.asObservable();

  private tipo_mesa$ = new BehaviorSubject<string>('');
  tipo_mesa = this.tipo_mesa$.asObservable();

  private num_max_comensales$ = new BehaviorSubject<number>(0);
  num_max_comensales = this.num_max_comensales$.asObservable();

  private num_mesas$ = new BehaviorSubject<number>(0);
  num_mesas = this.num_mesas$.asObservable();

  private es_crear_mesa$ = new BehaviorSubject<boolean>(false);
  es_crear_mesa = this.es_crear_mesa$.asObservable();

  constructor(private http: HttpClient) { }

  setEsCrearMesa(es_crear_mesa: boolean) {
    this.es_crear_mesa$.next(es_crear_mesa);
  }

  setMesa(mesa: Mesa) {
    this.mesa$.next(mesa);
  }

  setTipoMesa(tipo: string) {
    this.tipo_mesa$.next(tipo);
  }

  setNumMaxComensales(numero: number) {
    this.num_max_comensales$.next(numero);
  }

  setNumMesas(numero: number) {
    this.num_mesas$.next(numero);
  }

  getMesasDeEvento(id_evento: number): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.url + 'getMesasDeEvento/' + id_evento).pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER LA LISTA DE MESAS');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  getMesa(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(this.url + 'getMesa/' + id).pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER LA MESA');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  anyadirMesa(mesa: Mesa): Observable<Mesa> {
    return this.http.post<Mesa>(this.url + 'addMesa', mesa).pipe(
      catchError((err) => {
        console.error('ERROR AL AÑADIR LA MESA');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  editarMesa(mesa: Mesa, id_mesa: number): Observable<Mesa> {
    return this.http.patch<Mesa>(this.url + 'editMesa/' + id_mesa, mesa).pipe(
      catchError((err) => {
        console.error('ERROR AL EDITAR LA MESA');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  eliminarMesa(id: number): Observable<unknown> {
    return this.http.delete(this.url + 'deteleMesa/' + id).pipe(
      catchError((err) => {
        console.error('ERROR AL BORRAR LA MESA');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }
}
