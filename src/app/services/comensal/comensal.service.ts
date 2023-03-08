import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Comensal } from 'src/app/models/comensal';

@Injectable({
  providedIn: 'root'
})
export class ComensalService {

  url: string = 'http://localhost:8080/api/';

  private comensal$ = new BehaviorSubject<Comensal>({});
  comensal = this.comensal$.asObservable();

  private comensales$ = new BehaviorSubject<Comensal[]>([{}]);
  comensales = this.comensales$.asObservable();

  private num_comensales$ = new BehaviorSubject<number>(0);
  num_comensales = this.num_comensales$.asObservable();

  constructor(private http: HttpClient) { }

setNumComensales(num_comensales: number){
  this.num_comensales$.next(num_comensales);
}

  setComensal(comensal: Comensal) {
    this.comensal$.next(comensal);
  }

  setComensales(comensales: Comensal[]) {
    this.comensales$.next(comensales);
  }
  
  anyadirComensal(comensal: Comensal): Observable<Comensal> {
    return this.http.post<Comensal>(this.url + 'addComensal', comensal).pipe(
      catchError((err) => {
        console.error('ERROR AL ANYADIR EL COMENSAL');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      }));
  }
  
  editarComensal(comensal: Comensal, id_comensal: number): Observable<Comensal> {
    return this.http.patch<Comensal>(this.url + 'editComensal/' + id_comensal, comensal).pipe(
      catchError((err) => {
        console.error('ERROR AL EDITAR EL COMENSAL');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }
  
  eliminarComensal(id_comensal: number): Observable<unknown> {
    return this.http.delete(this.url + 'deteleComensal/' + id_comensal).pipe(
      catchError((err) => {
        console.error('ERROR AL ELIMINAR EL COMENSAL');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  getComensalesPorMesa(id_mesa: number): Observable<Comensal[]> {
    return this.http.get<Comensal[]>(this.url + 'getComensalesDeMesa/' + id_mesa).pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER COMENSALES POR MESA');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      }));
  }

  
  getComensalesPorEvento(id_evento: number): Observable<Comensal[]> {
    return this.http.get<Comensal[]>(this.url + 'getComensalesDeEvento/' + id_evento).pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER COMENSALES POR EVENTO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      }));
  }
}


