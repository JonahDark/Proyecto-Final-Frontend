import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from 'src/app/components/auth-components/register/register.component';
import { FormDecoracionComponent } from 'src/app/components/decoracion-components/form-decoracion/form-decoracion.component';
import { FormMenuComponent } from 'src/app/components/menu-components/form-menu/form-menu.component';
import { FormUbicacionComponent } from 'src/app/components/ubicacion-components/form-ubicacion/form-ubicacion.component';
import { ListaUsuariosComponent } from 'src/app/components/usuario-components/lista-usuarios/lista-usuarios.component';
import { AuthGuard } from 'src/app/guards/auth.guard';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'usuarios',
    component: ListaUsuariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'usuario',
    component: RegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'form-ubicacion',
    component: FormUbicacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'form-decoracion',
    component: FormDecoracionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'form-menu',
    component: FormMenuComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule { }
