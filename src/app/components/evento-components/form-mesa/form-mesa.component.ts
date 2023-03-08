import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Comensal } from 'src/app/models/comensal';
import { Evento } from 'src/app/models/evento';
import { Mesa } from 'src/app/models/mesa';
import { Usuario } from 'src/app/models/usuario';
import { ComensalService } from 'src/app/services/comensal/comensal.service';
import { EventoService } from 'src/app/services/evento/evento.service';
import { MesaService } from 'src/app/services/mesa/mesa.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-form-mesa',
  templateUrl: './form-mesa.component.html',
  styleUrls: ['./form-mesa.component.scss'],
})

export class FormMesaComponent implements OnInit {
  mesa!: Mesa;
  evento!: Evento;
  formMesa!: FormGroup;
  rolConfirmacion: any;
  es_crear_mesa: boolean = false;
  es_admin: boolean = false;
  admin!: Usuario;
  num_comensales_mesa:number = 0;
  comensales!:Comensal[];

  constructor(
    private alertController: AlertController,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private mesaService: MesaService,
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private comensalService: ComensalService
  ) { }

  ngOnInit() {
    this.eventoService.evento.subscribe({ next: (evento) => this.evento = evento });
    this.mesaService.mesa.subscribe({ next: (mesa) => this.mesa = mesa });
    this.mesaService.es_crear_mesa.subscribe({ next: (es_crear_mesa) => this.es_crear_mesa = es_crear_mesa });
    this.usuarioService.es_admin.subscribe({ next: (es_admin) => { this.es_admin = es_admin } });
    this.usuarioService.admin.subscribe({ next: (admin) => { this.admin = admin } });


    if (this.es_crear_mesa) {
      this.formMesa = this.formBuilder.group(
        {
          nombre: ['', Validators.required],
          tipoMesa: ['', Validators.required],
          id_evento: this.evento.id

        }
      );
    } else {

    this.comensalService.getComensalesPorMesa(this.mesa.id!).subscribe(
      {
        next: (comensales) => {
          this.comensales = comensales;
          this.comensalService.setComensales(this.comensales);
          this.num_comensales_mesa = Object.keys(this.comensales).length;            
        },
        error: (error) => console.error(`${error}`),
        complete: () => console.info('Listado de comensales por mesa completado')
      }
    );
    
      this.formMesa = this.formBuilder.group(
        {
          nombre: [this.mesa.nombre, Validators.required],
          tipoMesa: [this.mesa.tipoMesa, Validators.required],
          id_evento: this.evento.id
        }
      );
    }
  }


  ionViewWillEnter() {
    this.ngOnInit();
  }

  get nombre() {
    return this.formMesa.get('nombre')
  };

  get tipoMesa() {
    return this.formMesa.get('tipoMesa')
  };





  crearMesa() {
    if (this.formMesa.valid) {
      this.mesaService.anyadirMesa(this.formMesa.value).subscribe(
        {
          next: (mesa) => {
            this.mesa = mesa;
            this.mesaService.setEsCrearMesa(true);
            this.mesaService.setMesa(mesa);
            this.router.navigate(['/evento/formComensal']);
          },
          error: (error) => console.error(`${error}`),
          complete: () => console.info('Creación de mesa completada')
        }
      )
    }
  }

  editarMesa(mesa: Mesa) {
    if (this.formMesa.valid) {
      this.mesaService.editarMesa(this.formMesa.value, mesa.id!).subscribe(
        {
          next: (mesa) => {   
            if(mesa == null)         {
              console.log(null);
            }
            this.router.navigate(['/evento/mesas'])
          },
          error: (error) => console.error(`${error}`),
          complete: () => console.info('Edición de mesa terminado')
        }
      )
    }
  }

  validarFormulario() {
    if (this.formMesa.valid) {
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
        if (this.es_crear_mesa) {
          this.router.navigate(['/home/inicio']);
        } else {
          this.router.navigate(['/evento/mesas']);
        }
      }
    }
  };

}
