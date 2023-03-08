import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Menu } from 'src/app/models/menu';
import { EventoService } from '../evento/evento.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  url: string = 'http://localhost:8080/api/';

  private menu$ = new BehaviorSubject<Menu>({});
  menu = this.menu$.asObservable();

  private es_editar_menu$ = new BehaviorSubject<boolean>(false);
  es_editar_menu = this.es_editar_menu$.asObservable();

  constructor(
    private http: HttpClient,
    private eventoService: EventoService
    ) {}

  setEsEditarMenu(es_editar: boolean) {
    this.es_editar_menu$.next(es_editar);
  }

  deleteMenu(id: number): Observable<unknown> {
    return this.http.delete<Menu>(this.url + 'deleteMenu/' + id).pipe(
      catchError((err) => {
        console.error('ERROR AL BORRAR EL MENÚ');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  editMenu(id_menu:number, menu:Menu):Observable<Menu>{
    return this.http.patch<Menu>(this.url + 'editMenu/' + id_menu, menu).pipe(
      catchError((err) => {
        console.error('ERROR AL EDITAR EL MENÚ');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  createMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(this.url + 'createMenu', menu).pipe(
      catchError((err) => {
        console.error('ERROR AL CREAR EL MENÚ');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.url + 'getAllMenus').pipe(
      catchError((err) => {
        console.error('ERROR AL OBTENER LA LISTA DE MENÚS');
        console.error(err.error.message);
        return throwError(() => new Error(err));
      })
    );
  }

  getMenusNoEscogidos(menus: Menu[]): Observable<Menu[]>{
    var menus$ = new BehaviorSubject<Menu[]>([{}]);
    this.eventoService.getAllEventos().subscribe(
      {
        next:(eventosResponse)=>{
          for (let i = 0; i < menus.length; i++) {
            const menu = menus[i];
            for (let j = 0; j < eventosResponse.length; j++) {
              const eventoResponse = eventosResponse[j];
              if(menu.id === eventoResponse.menu?.id){
                menus.splice(i, 1);
              }
            }
          }
        }
      });
      menus$.next(menus);
      return menus$.asObservable();
  }

  setMenu(menu: Menu) {
    this.menu$.next(menu);
  }
}
