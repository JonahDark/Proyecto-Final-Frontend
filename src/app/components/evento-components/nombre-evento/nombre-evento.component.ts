import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/services/evento/evento.service';

@Component({
  selector: 'app-nombre-evento',
  templateUrl: './nombre-evento.component.html',
  styleUrls: ['./nombre-evento.component.scss'],
})
export class NombreEventoComponent implements OnInit {
  formNombre!: FormGroup;
  esEdicion: boolean = false;
  evento!: Evento;
  constructor(
    private eventoService: EventoService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.formNombre = this.formBuilder.group(
      {
        nombre: ['', Validators.required]
      }
    )
    this.eventoService.es_edicion_evento.subscribe({ next: (esEdicion) => this.esEdicion = esEdicion });

    if(this.esEdicion){
      this.eventoService.evento.subscribe({ next: (evento) => this.evento = evento });
      this.formNombre = this.formBuilder.group(
        {
          nombre: [this.evento.nombre, Validators.required]
        }
      )
    }
  }

  get nombre() {
    return this.formNombre.get('nombre');
  }

  validarFormulario() {
    if (this.formNombre.valid) {
      return true;
    } else {
      return false;
    }
  }

  irATipo() {
    if (this.formNombre.valid) {
      if (this.esEdicion) {        
        let nombre = this.formNombre.value['nombre'];
        this.evento.nombre = nombre;        
        this.eventoService.updateEvento(this.evento, this.evento.id!).subscribe({ next: (evento) => this.eventoService.setEvento(evento) });
        this.router.navigate(['/evento/editar-evento'])
      }else{
        let nombre = this.formNombre.value['nombre'];
        this.eventoService.setNombre(nombre);
        this.router.navigate(['/evento/fechaHora']);
      }
    }
  }
}
