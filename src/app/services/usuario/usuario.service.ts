import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Evento } from 'src/app/models/evento';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url: string = 'http://localhost:8080/api';

  private usuario$ = new BehaviorSubject<Usuario>({});
  usuario = this.usuario$.asObservable();

  private es_crear_usuario$ = new BehaviorSubject<boolean>(false);
  es_crear_usuario = this.es_crear_usuario$.asObservable();


  private es_crear_evento$ = new BehaviorSubject<boolean>(false);
  es_crear_evento = this.es_crear_evento$.asObservable();

  private es_admin$ = new BehaviorSubject<boolean>(false);
  es_admin = this.es_admin$.asObservable();

  private admin$ = new BehaviorSubject<Usuario>({});
  admin = this.admin$.asObservable();

  constructor(private http: HttpClient) { }

  setUsuario(usuario: Usuario) {
    this.usuario$.next(usuario);
  }

  setAdmin(admin: Usuario) {
    this.admin$.next(admin);
  }

  setEsAdmin(es_admin: boolean){
    this.es_admin$.next(es_admin);
  }

  setEsCrearUsuario(es_crear_usuario: boolean){
    this.es_crear_usuario$.next(es_crear_usuario);
  }

  setEsCrearEvento(es_crear_evento: boolean){
    this.es_crear_evento$.next(es_crear_evento);
  }

  postUsuario(usuario: Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(this.url + '/createUser', usuario).pipe(
      catchError((err) => {
        console.error('ERROR AL CREAR EL USUARIO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      }
      ));
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url + '/getAllUsuarios').pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER USUARIO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      }
      ));
  }

  getUserByUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(this.url + '/getUserByUsername/' + username).pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER USUARIO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      }
      ));
  }

  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.url + '/getUserById/' + id).pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER USUARIO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      }
      ));
  }

  deleteUser(id_usuario: number): Observable<unknown> {
    return this.http.delete(this.url + '/deleteUser/' + id_usuario).pipe(
      catchError((err) => {
        console.error('ERROR AL BORRAR USUARIO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      }
      ));
  }

  editUser(id_usuario: number, usuario: Usuario ): Observable<Usuario> {
    return this.http.patch<Usuario>(this.url + '/editUser/' + id_usuario, usuario).pipe(
      catchError((err) => {
        console.error('ERROR AL EDITAR EL USUARIO');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

}
