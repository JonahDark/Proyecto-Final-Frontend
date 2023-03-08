

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  admin!: Usuario;
  usuario!: Usuario;
  formularioRegistro!: FormGroup;
  rolConfirmacion: any;
  es_admin: boolean = false;
  es_crear_usuario: boolean = false;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.usuarioService.es_crear_usuario.subscribe({ next: (es_crear_usuario) => this.es_crear_usuario = es_crear_usuario });
    this.usuarioService.es_admin.subscribe({ next: (es_admin) => this.es_admin = es_admin });
    this.usuarioService.usuario.subscribe({ next: (usuario) => this.usuario = usuario });
    this.usuarioService.admin.subscribe({ next: (admin) => this.admin = admin });

    if (this.es_admin) {
      if (this.es_crear_usuario) {
        this.formularioRegistro = this.formBuilder.group(
          {
            username: ['', Validators.compose([
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(20)
            ])],
            email: ['', Validators.compose([
              Validators.required,
              Validators.email
            ])],
             password: ['', Validators.compose([
            Validators.required,
            Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*\W)[a-zA-Z0-9\S]{9,30}$/)

          ])],
            telefono: ['', Validators.compose([
              Validators.required,
              Validators.pattern('^[0-9]{9}$')
            ])],
            rol: '',
            acepta: true
          }
        );
      } else {
        var usuario = this.usuario;
        this.formularioRegistro = this.formBuilder.group(
          {
            username: [usuario.username, Validators.compose([
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(20)
            ])],
            email: [usuario.email, Validators.compose([
              Validators.required,
              Validators.email
            ])],
             password: ['', Validators.compose([
            Validators.required,
            Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*\W)[a-zA-Z0-9\S]{9,30}$/)

          ])],
            telefono: [usuario.telefono, Validators.compose([
              Validators.required,
              Validators.pattern('^[0-9]{9}$')
            ])],
            rol: usuario.rol
          });
      }
    } else {      
      //Construimos el FormGroup
      this.formularioRegistro = this.formBuilder.group(
        {
          username: ['', Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(20)
          ])],
          email: ['', Validators.compose([
            Validators.required,
            Validators.email
          ])],
          password: ['', Validators.compose([
            Validators.required,
            Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*\W)[a-zA-Z0-9\S]{9,30}$/)

          ])],
          telefono: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]{9}$')
          ])],
          acepta: [false, Validators.requiredTrue],
          rol: 'USER'
        });
    }

  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  /*Se implementan los getters para poder bindearlos en la vista y
   revisar si cumple lo requerido gracias a los Validators*/
  get username() {
    return this.formularioRegistro.get('username');
  }

  get email() {
    return this.formularioRegistro.get('email');
  }

  get password() {
    return this.formularioRegistro.get('password');
  }

  get telefono() {
    return this.formularioRegistro.get('telefono');
  }

  get acepta() {
    return this.formularioRegistro.get('acepta');
  }

  get rol() {
    return this.formularioRegistro.get('rol');
  }

  validarFormulario() {
    if (this.formularioRegistro.valid) {
      return true;
    } else {
      return false;
    }
  }

  editarUsuario(id_usuario: number) {
    this.usuarioService.editUser(id_usuario, this.formularioRegistro.value).subscribe({
      next: () => this.router.navigate(['/admin/usuarios']),
      error: () => this.errorToast("Error al editar el usuario"),
      complete: () => this.successToast("Usuario editado correctamente")
    });
  }

  crearUsuario() {
    this.usuarioService.postUsuario(this.formularioRegistro.value).subscribe(
      {
        next: () => {
          this.usuarioService.setEsCrearUsuario(false);
          this.router.navigate(['/admin/usuarios']);
        },
        error: () => this.errorToast("Username o email ya registrado"),
        complete: () => this.successToast("Usuario creado correctamente")
      }
    );
  }

  registrarse() {
    if (this.formularioRegistro.valid) {
      this.authService.register(this.formularioRegistro.value).subscribe(
        {
          next: (usuario) => {
            this.usuario = usuario;
            this.router.navigate(['/auth/login']);
          },
          error: () => this.errorToast("Username, email o teléfono ya registrado"),
          complete: () => this.successToast("Usuario registrado correctamente")
        }
      );
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
        if (this.es_admin) {          
          this.router.navigate(['admin/usuarios']);
        } else {
          this.usuarioService.setEsAdmin(false);
          this.router.navigate(['/auth/login']);
        }
      }
    }
  };

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
