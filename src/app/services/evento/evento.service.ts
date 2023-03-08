import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Evento } from 'src/app/models/evento';
import { Ubicacion } from 'src/app/models/ubicacion';
import { Decoracion } from 'src/app/models/decoracion';
import { Menu } from 'src/app/models/menu';

@Injectable({
  providedIn: 'root'
})
export class EventoService {


  private url: string = 'http://localhost:8080/api/';

  private precio_total$ = new BehaviorSubject<number>(0);
  precio_total = this.precio_total$.asObservable();

  private es_edicion_evento$ = new BehaviorSubject<boolean>(false);
  es_edicion_evento = this.es_edicion_evento$.asObservable();

  private evento$ = new BehaviorSubject<Evento>({});
  evento = this.evento$.asObservable();

  private pago_confirmado$ = new BehaviorSubject<Boolean>(false);
  pago_confirmado = this.pago_confirmado$.asObservable();

  private id_evento$ = new BehaviorSubject<number>(0);
  id_evento = this.id_evento$.asObservable();

  private id_usuario$ = new BehaviorSubject<number>(0);
  id_usuario = this.id_usuario$.asObservable();

  private nombre$ = new BehaviorSubject<string>('');
  nombre = this.nombre$.asObservable();

  private tipo$ = new BehaviorSubject<string>('');
  tipo = this.tipo$.asObservable();

  private fecha$ = new BehaviorSubject<string>('');
  fecha = this.fecha$.asObservable();

  private horario$ = new BehaviorSubject<string>('');
  horario = this.horario$.asObservable();

  private id_ubicacion$ = new BehaviorSubject<number>(0);
  id_ubicacion = this.id_ubicacion$.asObservable();

  private id_decoracion$ = new BehaviorSubject<number>(0);
  id_decoracion = this.id_decoracion$.asObservable();

  private id_menu$ = new BehaviorSubject<number>(0);
  id_menu = this.id_menu$.asObservable();

  private decoracion$ = new BehaviorSubject<Decoracion>({});
  decoracion = this.decoracion$.asObservable();

  private menu$ = new BehaviorSubject<Menu>({});
  menu = this.menu$.asObservable();

  constructor(private http: HttpClient) { }

  setIdEvento(id_evento: number) {
    this.id_evento$.next(id_evento);
  }

  setIdUsuario(id_usuario: number) {
    this.id_usuario$.next(id_usuario);
  }

  setTipo(tipo: string) {
    this.tipo$.next(tipo);
  }

  setNombre(nombre: string) {
    this.nombre$.next(nombre);
  }

  setFecha(fecha: string) {
    this.fecha$.next(fecha);
  }

  setHorario(horario: string) {
    this.horario$.next(horario);
  }

  setEsEdicionEvento(edicion: boolean) {
    this.es_edicion_evento$.next(edicion);
  }

  setIdUbicacion(id_ubicacion: number) {
    this.id_ubicacion$.next(id_ubicacion);
  }

  setIdDecoracion(id_decoracion: number) {
    this.id_decoracion$.next(id_decoracion);
  }

  setIdMenu(id_menu: number) {
    this.id_menu$.next(id_menu);
  }

  setDecoracion(decoracion: Decoracion) {
    this.decoracion$.next(decoracion);
  }

  setMenu(menu: Menu) {
    this.menu$.next(menu);
  }

  setEvento(evento: Evento) {
    this.evento$.next(evento);
  }

  setPrecioTotal(precio: number) {
    this.precio_total$.next(precio);
  }

  setPagado(pago_confirmado: Boolean) {
    this.pago_confirmado$.next(pago_confirmado);
  }

  eliminarEvento(id: number): Observable<unknown> {
    return this.http.delete(this.url + 'deteleEvento/' + id).pipe(
      catchError((err) => {
        console.error('ERROR AL BORRAR EL EVENTO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  crearEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.url + 'crearEvento', evento).pipe(
      catchError((err) => {
        console.error('ERROR AL GUARDAR EVENTO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  updateEvento(evento: Evento, id_evento: number): Observable<Evento> {
    return this.http.patch<Evento>(this.url + 'updateEvento/' + id_evento, evento).pipe(
      catchError((err) => {
        console.error('ERROR AL ACTUALIZAR EVENTO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  getEventosDeUsuario(id_usuario: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.url + 'getEventosDeUsuario/' + id_usuario).pipe(
      catchError((err) => {
        console.error('ERROR AL MOSTRAR EVENTOS');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  getAllEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.url + 'getAllEventos').pipe(
      catchError((err) => {
        console.error('ERROR AL MOSTRAR EVENTOS');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }




}
