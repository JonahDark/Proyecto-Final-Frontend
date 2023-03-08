import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Token } from 'src/app/models/token';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventoService } from 'src/app/services/evento/evento.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  token!: Token;
  usuario!: Usuario;
  formularioInicioSesion!: FormGroup;
  rolConfirmacion!: any;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private eventoService: EventoService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.usuarioService.setEsAdmin(false);
    // Si existe un token en el login se elimina
    if (sessionStorage.getItem('token')) {
      sessionStorage.removeItem('token')
    }
    //FormBuilder y FormGroup nos ayuda a crear un body para hacer la request
    this.formularioInicioSesion = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required]
      }
    );
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  get username() {
    return this.formularioInicioSesion.get('username')
  };
  get password() {
    return this.formularioInicioSesion.get('password')
  };


  login() {
    if (this.formularioInicioSesion.valid) {
      this.authService.login(this.formularioInicioSesion.value).subscribe(
        {
          next: (token) => {
            this.token = token;
            sessionStorage.setItem('token', this.token.token);
            this.usuarioService.getUserByUsername(this.formularioInicioSesion.value['username']).subscribe(
              {
                next: (usuario) => {
                  this.usuario = usuario;
                  if(this.usuario.rol === 'ADMIN'){
                    this.usuarioService.setAdmin(this.usuario);
                    this.usuarioService.setEsAdmin(true);
                    this.eventoService.setIdUsuario(this.usuario.id!);
                    this.router.navigate(['/home/inicio']);
                  }else{                                     
                    this.usuarioService.setUsuario(this.usuario);
                    this.eventoService.setIdUsuario(this.usuario.id!);
                    this.router.navigate(['/home/inicio']);
                  }
                },
                error: () => this.errorToast("No existe ningun usuario con este username"),
                complete: () => console.info("Obtención de usuario completada")
              }
            )
          },
          error: () => this.errorToast("Error al realizar el Login"),
          complete: () => this.successToast("Login correcto")
        }
      )
    }
  }

  validarFormulario() {
    if (this.formularioInicioSesion.valid) {
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
        this.router.navigate(['auth/login']);
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
