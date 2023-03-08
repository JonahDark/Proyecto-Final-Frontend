import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Decoracion } from 'src/app/models/decoracion';
import { Menu } from 'src/app/models/menu';
import { DecoracionService } from 'src/app/services/decoracion/decoracion.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-form-decoracion',
  templateUrl: './form-decoracion.component.html',
  styleUrls: ['./form-decoracion.component.scss'],
})
export class FormDecoracionComponent implements OnInit {

  es_editar_decoracion: boolean = false;
  es_admin: boolean = false;
  form_decoracion!: FormGroup;
  decoracion!: Decoracion;
  rolConfirmacion: any;
  constructor(
    private decoracionService: DecoracionService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {    
    this.usuarioService.es_admin.subscribe({ next: (es_admin) => this.es_admin = es_admin });
    this.decoracionService.decoracion.subscribe({ next: (decoracion) => this.decoracion = decoracion });
    this.decoracionService.es_editar_decoracion.subscribe({ next: (es_editar_decoracion) => this.es_editar_decoracion = es_editar_decoracion });

    if (this.es_editar_decoracion) {
      this.form_decoracion = this.formBuilder.group(
        {
          tipo: [this.decoracion.tipo, Validators.required],
          nombre: [this.decoracion.nombre, Validators.required],
          precio: [this.decoracion.precio, Validators.required],
          foto: [this.decoracion.foto, Validators.required]
        });
    } else {
      this.form_decoracion = this.formBuilder.group(
        {
          tipo: ['', Validators.required],
          nombre: ['', Validators.required],
          precio: ['', Validators.required],
          foto: ['', Validators.required] //https://i.postimg.cc/CMkS4WbF/sala2.jpg <- Para prueba
        });
    }
  }

  get tipo() {
    return this.form_decoracion.get('tipo');
  }

  get nombre() {
    return this.form_decoracion.get('nombre');
  }

  get precio() {
    return this.form_decoracion.get('precio');
  }

  get foto() {
    return this.form_decoracion.get('foto');
  }



  crearDecoracion() {
    if (this.form_decoracion.valid) {
      this.decoracionService.createDecoracion(this.form_decoracion.value).subscribe(
        {
          next: () => {
            this.router.navigate(['/evento/decoraciones']);
          },
          error: () => {
            this.errorToast('Error al crear la decoración');
          },
          complete: () => this.successToast('Creacion de decoración satisfactoriamente')
        }
      )
    }
  }

  editarDecoracion(decoracion: Decoracion) {
    if (this.form_decoracion.valid) {
      this.decoracionService.editDecoracion(decoracion.id!, this.form_decoracion.value).subscribe(
        {
          next: () => {
            this.successToast('Edición de decoracion satisfactoriamente');
            this.router.navigate(['/evento/decoraciones']);
          },
          error: () => this.errorToast('Error al editar el decoracion'),
          complete: () => console.info('Edición de decoracion completada')
        }
      )
    }
  }

  validarFormulario() {
    if (this.form_decoracion.valid) {
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
        this.router.navigate(['/evento/decoraciones']);
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
