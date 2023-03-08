import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Comensal } from 'src/app/models/comensal';
import { Mesa } from 'src/app/models/mesa';
import { ComensalService } from 'src/app/services/comensal/comensal.service';
import { EventoService } from 'src/app/services/evento/evento.service';
import { MesaService } from 'src/app/services/mesa/mesa.service';

@Component({
  selector: 'app-form-comensal',
  templateUrl: './form-comensal.component.html',
  styleUrls: ['./form-comensal.component.scss'],
})
export class FormComensalComponent implements OnInit {
  mesa!: Mesa;
  formComensal!: FormGroup;
  rolConfirmacion: any;
  comensal!: Comensal;
  comensales: Comensal[] = [];
  es_crear_mesa: boolean = false;
  es_crear_comensal: boolean = false;
  esEdicion: boolean = false;
  

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private mesaService: MesaService,
    private alertController: AlertController,
    private comensalService: ComensalService,
    private eventoService: EventoService
  ) { }

  ngOnInit() {
    this.eventoService.es_edicion_evento.subscribe({ next: (esEdicion) => this.esEdicion = esEdicion });    
    this.comensalService.comensal.subscribe({ next: (comensal) => this.comensal = comensal });
    this.mesaService.mesa.subscribe({ next: (mesa) =>  this.mesa = mesa });    
    this.mesaService.es_crear_mesa.subscribe({ next: (es_crear_mesa) => this.es_crear_mesa = es_crear_mesa });


    if (!this.es_crear_mesa) {
      this.formComensal = this.formBuilder.group(
        {
          nombre: [this.comensal.nombre, Validators.required],
          apellidos: [this.comensal.apellidos, Validators.required],
          infantil: this.comensal.infantil,
          alergeno: this.comensal.alergeno,
          id_mesa: this.mesa.id
        }
      )
    } else {
      this.formComensal = this.formBuilder.group(
        {
          nombre: ['', Validators.required],
          apellidos: ['', Validators.required],
          infantil: false,
          alergeno: false,
          id_mesa: this.mesa.id
        }
      )
    }
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }


  get nombre() {
    return this.formComensal.get('nombre')
  };
  get apellidos() {
    return this.formComensal.get('apellidos')
  };
  get infantil() {
    return this.formComensal.get('infantil')
  };
  get alergeno() {
    return this.formComensal.get('alergeno')
  };


  crearComensal() {
    if (this.formComensal.valid) {
      this.comensalService.anyadirComensal(this.formComensal.value).subscribe(
        {
          next: () => this.router.navigate(['/evento/mesa']),
          error: (error) => console.error(`${error}`),
          complete: () => console.info('Creación de comensal completada')
        }
      )
    }
  }

  editarComensal(comensal: Comensal) {
    if (this.formComensal.valid) {
      this.comensalService.editarComensal(this.formComensal.value, comensal.id!).subscribe(
        {
          next: () => this.router.navigate(['/evento/mesa']),
          error: (error) => console.error(`${error}`),
          complete: () => console.info('Edición de comensal completada')
        }
      )
    }
  }


  validarFormulario() {
    if (this.formComensal.valid) {
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
        this.router.navigate(['/evento/mesa']);
      }
    }
  };

}
