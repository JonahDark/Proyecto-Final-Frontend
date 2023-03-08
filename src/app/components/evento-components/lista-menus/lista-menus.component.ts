import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Evento } from 'src/app/models/evento';
import { Menu } from 'src/app/models/menu';
import { DecoracionService } from 'src/app/services/decoracion/decoracion.service';
import { EventoService } from 'src/app/services/evento/evento.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { MesaService } from 'src/app/services/mesa/mesa.service';
import { UbicacionService } from 'src/app/services/ubicacion/ubicacion.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-lista-menus',
  templateUrl: './lista-menus.component.html',
  styleUrls: ['./lista-menus.component.scss'],
})
export class ListaMenusComponent implements OnInit {
  menus!: Menu[];
  num_menus:number=0;
  evento: Evento = {};
  precioTotal: number = 0;  
  _evento!: Evento;
  es_admin: boolean = false;
  es_crear_evento: boolean = false;
  es_edicion_evento: boolean = false;
  constructor(
    private menuService: MenuService,
    private ubicacionService: UbicacionService,
    private usuarioService: UsuarioService,
    private decoracionService: DecoracionService,
    private mesaService: MesaService,
    private router: Router,
    private eventoService: EventoService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    
    this.eventoService.es_edicion_evento.subscribe({ next: (es_edicion_evento) => this.es_edicion_evento = es_edicion_evento });
    this.usuarioService.es_crear_evento.subscribe({ next: (es_crear_evento) => this.es_crear_evento = es_crear_evento });
    this.usuarioService.es_admin.subscribe({ next: (es_admin) => this.es_admin = es_admin });
    this.menuService.getMenus().subscribe(
      {
        next: (menus: Menu[]) => {
          this.menus = menus;
          this.num_menus = Object.keys(this.menus).length
          if(this.es_edicion_evento){
            this.menuService.getMenusNoEscogidos(this.menus).subscribe(
              {
                next:(menus)=>this.menus = menus,
                error: (error) => console.error(`${error}`),
                complete: () => console.info('Petición de lista de menús terminada')
              }
            )
          }
        },
        error: (error) => console.error(`${error}`),
        complete: () => console.info('Petición de lista de menús terminada')
      }
    );
  }


  ionViewWillEnter() {
    this.ngOnInit();
  }

  ngOnChanges() {
    this.ngOnInit();
  }


  irAAddMenu() {
    this.menuService.setEsEditarMenu(false);
    this.router.navigate(['/admin/form-menu']);
  }

  irAEditarMenu(menu: Menu) {
    this.menuService.setEsEditarMenu(true);
    this.menuService.setMenu(menu);
    this.router.navigate(['/admin/form-menu']);
  }

  borrarMenu(id_menu: number) {
    this.menuService.deleteMenu(id_menu).subscribe(
      {
        next: () => this.ngOnChanges(),
        error: () => this.errorToast("Error al borrar el Menú"),
        complete: () => this.successToast("Borrado de Menú completado")
      }
    )
  }

  elegirMenu(menu: Menu) {
    if (this.es_edicion_evento) {
      this.eventoService.evento.subscribe({ next: (evento) => this.evento = evento });
      this.evento.menu = menu;
      this.eventoService.updateEvento(this.evento, this.evento.id!).subscribe({ next: (evento) => this.eventoService.setEvento(evento) });
      this.router.navigate(['/evento/editar-evento'])
    } else {
      this.menuService.setMenu(menu);
      let id_menu = menu.id!;
      this.eventoService.setIdMenu(id_menu);


      //PUNTO DONDE SE CREA EL EVENTO A PARTIR DE LOS OBSERVERS
      this.eventoService.nombre.subscribe(
        {
          next: (nombre) => this.evento.nombre = nombre
        });

      this.eventoService.tipo.subscribe(
        {
          next: (tipo) => this.evento.tipo = tipo
        });

      this.eventoService.fecha.subscribe(
        {
          next: (fecha) => this.evento.fecha = fecha
        });

      this.eventoService.horario.subscribe(
        {
          next: (horario) => this.evento.horario = horario
        });

      this.eventoService.id_decoracion.subscribe(
        {
          next: (id_decoracion) => this.evento.id_decoracion = id_decoracion
        });
      this.decoracionService.decoracion.subscribe(
        {
          next: (decoracion) => this.evento.decoracion = decoracion
        });

      this.eventoService.id_ubicacion.subscribe(
        {
          next: (id_ubicacion) => this.evento.id_ubicacion = id_ubicacion
        });

      this.ubicacionService.ubicacion.subscribe(
        {
          next: (ubicacion) => this.evento.ubicacion = ubicacion
        });

      this.eventoService.id_usuario.subscribe(
        {
          next: (id_usuario) => this.evento.id_usuario = id_usuario
        });

      this.usuarioService.usuario.subscribe(
        {
          next: (usuario) => this.evento.usuario = usuario
        })

      this.eventoService.id_menu.subscribe(
        {
          next: (id_menu) => this.evento.id_menu = id_menu
        });

      this.menuService.menu.subscribe(
        {
          next: (menu) => this.evento.menu = menu
        });

      this.evento.pago_confirmado = false;
      this.evento.precio_total = 0;

      this.eventoService.crearEvento(this.evento).subscribe(
        {
          next: (evento) => {
            this.evento = evento
            this.eventoService.setEvento(this.evento);
            this.mesaService.setEsCrearMesa(true);
            this.router.navigate(['/evento/formMesa'])
          },
          error: () => this.errorToast('Error al crear el evento'),
          complete: () => this.successToast('Creacion de evento completada')
        });
    }

  }

  async successToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'middle',
      color: 'success'
    });
    await toast.present();
  }


  async errorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'middle',
      color: 'danger'
    });
    await toast.present();
  }


}
