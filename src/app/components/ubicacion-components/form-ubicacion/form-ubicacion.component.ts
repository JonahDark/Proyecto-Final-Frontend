import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Ubicacion } from 'src/app/models/ubicacion';
import { UbicacionService } from 'src/app/services/ubicacion/ubicacion.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-form-ubicacion',
  templateUrl: './form-ubicacion.component.html',
  styleUrls: ['./form-ubicacion.component.scss'],
})
export class FormUbicacionComponent implements OnInit {
  es_editar_ubicacion: boolean = false;
  es_admin: boolean = false;
  form_ubicacion!: FormGroup;
  ubicacion!: Ubicacion;
  rolConfirmacion: any;

  constructor(
    private ubicacionService: UbicacionService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.usuarioService.es_admin.subscribe({ next: (es_admin) => this.es_admin = es_admin });
    this.ubicacionService.ubicacion.subscribe({ next: (ubicacion) => this.ubicacion = ubicacion });
    this.ubicacionService.es_editar_ubicacion.subscribe({ next: (es_editar_ubicacion) => this.es_editar_ubicacion = es_editar_ubicacion });

    if (this.es_editar_ubicacion) {

      this.form_ubicacion = this.formBuilder.group(
        {
          tipo: [this.ubicacion.tipo, Validators.required],
          nombre: [this.ubicacion.nombre, Validators.required],
          aforo: [this.ubicacion.aforo, Validators.required],
          precio: [this.ubicacion.precio, Validators.required],
          descripcion: [this.ubicacion.descripcion, Validators.required],
          foto: [this.ubicacion.foto, Validators.required]
        });
    } else {
      this.form_ubicacion = this.formBuilder.group(
        {
          tipo: ['', Validators.required],
          nombre: ['', Validators.required],
          aforo: ['', Validators.required],
          precio: ['', Validators.required],
          descripcion: ['', Validators.required],
          foto: ['', Validators.required] //https://i.postimg.cc/CMkS4WbF/sala2.jpg <- Para prueba
        });
    }
  }


  get tipo() {
    return this.form_ubicacion.get('tipo');
  }
  get nombre() {
    return this.form_ubicacion.get('nombre');
  }
  get aforo() {
    return this.form_ubicacion.get('aforo');
  }
  get precio() {
    return this.form_ubicacion.get('precio');
  }
  get descripcion() {
    return this.form_ubicacion.get('descripcion');
  }
  get foto() {
    return this.form_ubicacion.get('foto');
  }

  crearUbicacion() {
    if (this.form_ubicacion.valid) {
      this.ubicacionService.createUbicacion(this.form_ubicacion.value).subscribe(
        {
          next: () => {
            this.successToast('Creacion de ubicación satisfactoriamente');
            this.router.navigate(['/evento/ubicaciones']);
          },
          error: () => {
            this.errorToast('Error al crear la ubicacion');
          },
          complete: () => console.info('Creacion de ubicación completada')
        }
      )
    }
  }

  editarUbicacion(ubicacion: Ubicacion) {
    if (this.form_ubicacion.valid) {
      this.ubicacionService.editUbicacion(ubicacion.id!, this.form_ubicacion.value).subscribe(
        {
          next: () => {
            this.successToast('Edición de ubicación satisfactoriamente');
            this.router.navigate(['/evento/ubicaciones']);
          },
          error: () => {
            this.errorToast('Error al editar la ubicacion');
          },
          complete: () => console.info('Edición de ubicación completada')
        }
      )
    }
  }




  validarFormulario() {
    if (this.form_ubicacion.valid) {
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
        this.router.navigate(['/evento/ubicaciones']);
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
