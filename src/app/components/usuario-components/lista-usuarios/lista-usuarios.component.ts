import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
})
export class ListaUsuariosComponent implements OnInit {

  usuarios!: Usuario[];
  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe({ next: (usuarios) => this.usuarios = usuarios })
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  borrarUsuario(id_usuario: number) {
    this.usuarioService.deleteUser(id_usuario).subscribe(
      {
        next: () => this.ngOnInit(),
        error: (error) => console.error(`${error}`),
        complete: () => console.info('Eliminación de usuario completada')
      });
  }

  irAEditarUsuario(usuario: Usuario){
    this.usuarioService.setUsuario(usuario);
    this.usuarioService.setEsAdmin(true);
    this.router.navigate(['/auth/register']);
  }

  irAAddUsuario(){    
    this.usuarioService.setEsAdmin(true);
    this.usuarioService.setEsCrearUsuario(true);    
    this.router.navigate(['/auth/register']);
  }

}
