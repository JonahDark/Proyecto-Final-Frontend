import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Token } from 'src/app/models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = 'http://localhost:8080/api/auth';

  private es_logout$ = new BehaviorSubject<boolean>(false);
  es_logout = this.es_logout$.asObservable();

  constructor(private http: HttpClient) { }


  setEsLogout(es_logout: boolean) {
    this.es_logout$.next(es_logout);
  }

  login(usuario: Usuario): Observable<Token> {
    return this.http.post<Token>(this.url + '/login', usuario).pipe(
      catchError((err) => {
        console.error('ERROR AL LOGUEARSE');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url + '/register', usuario).pipe(
      catchError((err) => {
        console.error('ERROR AL REGISTRARSE');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      }
      )
    );
  }



}
