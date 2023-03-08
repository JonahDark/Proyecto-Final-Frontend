import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { EventoService } from 'src/app/services/evento/evento.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  es_admin: boolean = false;
  usuario!: Usuario;
  admin!: Usuario;
  constructor(
    private router: Router,
    private eventoService: EventoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.usuarioService.setEsCrearEvento(false);
    this.eventoService.setEsEdicionEvento(false);
    this.usuarioService.usuario.subscribe({
      next: (usuario) => (this.usuario = usuario),
    });
    this.usuarioService.admin.subscribe({
      next: (admin) => (this.admin = admin),
    });
    this.usuarioService.es_admin.subscribe({
      next: (es_admin) => (this.es_admin = es_admin),
    });
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  irACrearEvento() {
    this.usuarioService.setEsCrearEvento(true);
    this.eventoService.setEsEdicionEvento(false);
    this.router.navigate(['/evento/tipo']);
  }

  irAVerEventos() {
    this.router.navigate(['/evento/eventos']);
  }

  cerrarSesion() {
    this.usuarioService.setEsAdmin(false);
    this.usuarioService.setEsCrearEvento(false);
    this.eventoService.setEsEdicionEvento(false);
    this.router.navigate(['/auth/login']);
  }
}
