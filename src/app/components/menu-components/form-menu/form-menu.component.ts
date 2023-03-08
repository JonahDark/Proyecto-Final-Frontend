import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Menu } from 'src/app/models/menu';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-form-menu',
  templateUrl: './form-menu.component.html',
  styleUrls: ['./form-menu.component.scss'],
})
export class FormMenuComponent implements OnInit {
  es_editar_menu: boolean = false;
  es_admin: boolean = false;
  form_menu!: FormGroup;
  menu!: Menu;
  rolConfirmacion: any;
  constructor(
    private menuService: MenuService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.usuarioService.es_admin.subscribe({ next: (es_admin) => this.es_admin = es_admin });
    this.menuService.menu.subscribe({ next: (menu) => this.menu = menu });
    this.menuService.es_editar_menu.subscribe({ next: (es_editar_menu) => this.es_editar_menu = es_editar_menu });

    if (this.es_editar_menu) {
      this.form_menu = this.formBuilder.group(
        {
          tipo: [this.menu.tipo, Validators.required],
          nombre: [this.menu.nombre, Validators.required],
          precio_menu: [this.menu.precio_menu, Validators.required],          
          precio_menu_infantil: [this.menu.precio_menu_infantil, Validators.required], 
          precio_menu_alergeno: [this.menu.precio_menu_alergeno, Validators.required],
          precio_menu_alergeno_infantil: [this.menu.precio_menu_alergeno_infantil, Validators.required],
          foto: [this.menu.foto, Validators.required]
        });
    } else {
      this.form_menu = this.formBuilder.group(
        {
          tipo: ['', Validators.required],
          nombre: ['', Validators.required],
          precio_menu: ['', Validators.required],
          precio_menu_infantil: ['', Validators.required], 
          precio_menu_alergeno: ['', Validators.required],
          precio_menu_alergeno_infantil: ['', Validators.required],          
          foto: ['', Validators.required] //https://i.postimg.cc/CMkS4WbF/sala2.jpg <- Para prueba
        });
    }
  }

  get tipo() {
    return this.form_menu.get('tipo');
  }
  
  get nombre() {
    return this.form_menu.get('nombre');
  }
  
  get precio_menu() {
    return this.form_menu.get('precio_menu');
  }
   get precio_menu_infantil() {
    return this.form_menu.get('precio_menu_infantil');
  }
  
  get precio_menu_alergeno() {
    return this.form_menu.get('precio_menu_alergeno');
  }
  
  get precio_menu_alergeno_infantil() {
    return this.form_menu.get('precio_menu_alergeno_infantil');
  }
  
  get descripcion() {
    return this.form_menu.get('descripcion');
  }
  
  get foto() {
    return this.form_menu.get('foto');
  }



  crearMenu() {
    if (this.form_menu.valid) {
      this.menuService.createMenu(this.form_menu.value).subscribe(
        {
          next: () => {
            this.successToast('Creacion de menú satisfactoriamente');
            this.router.navigate(['/evento/menus']);
          },
          error: () => {
            this.errorToast('Error al crear la menú');
          },
          complete: () => console.info('Creacion de menú completada')
        }
      )
    }
  }

  editarMenu(menu: Menu) {
    if (this.form_menu.valid) {
      this.menuService.editMenu(menu.id!, this.form_menu.value).subscribe(
        {
          next: () => {
            this.successToast('Edición de menú satisfactoriamente');
            this.router.navigate(['/evento/menus']);
          },
          error: () => {
            this.errorToast('Error al editar el menú');
          },
          complete: () => console.info('Edición de menú completada')
        }
      )
    }
  }

  validarFormulario() {
    if (this.form_menu.valid) {
      return true;
    } else {
      return false;
    }
  }


  async mostrarAlerta() {
    const alert = await this.alertController.create(
      {
        header: '¿Esta seguro?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Aceptar',
            role: 'confirm'
          }
        ]
      });
    await alert.present();
    this.rolConfirmacion = await alert.onDidDismiss();
    if (this.rolConfirmacion) {
      if (this.rolConfirmacion.role === 'confirm') {
        this.router.navigate(['/evento/menus']);
      }
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
