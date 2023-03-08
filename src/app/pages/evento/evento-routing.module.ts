import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleEventoComponent } from 'src/app/components/evento-components/detalle-evento/detalle-evento.component';
import { DetalleMesaComponent } from 'src/app/components/evento-components/detalle-mesa/detalle-mesa.component';
import { DetalleUbicacionComponent } from 'src/app/components/evento-components/detalle-ubicacion/detalle-ubicacion.component';
import { DetallesPagoComponent } from 'src/app/components/evento-components/detalles-pago/detalles-pago.component';
import { EditarEventoComponent } from 'src/app/components/evento-components/editar-evento/editar-evento.component';
import { FechaHoraEventoComponent } from 'src/app/components/evento-components/fecha-hora-evento/fecha-hora-evento.component';
import { FormComensalComponent } from 'src/app/components/evento-components/form-comensal/form-comensal.component';
import { FormMesaComponent } from 'src/app/components/evento-components/form-mesa/form-mesa.component';
import { ListaComensalesComponent } from 'src/app/components/evento-components/lista-comensales/lista-comensales.component';
import { ListaDecoracionComponent } from 'src/app/components/evento-components/lista-decoracion/lista-decoracion.component';
import { ListaEventosComponent } from 'src/app/components/evento-components/lista-eventos/lista-eventos.component';
import { ListaMenusComponent } from 'src/app/components/evento-components/lista-menus/lista-menus.component';
import { ListaMesasComponent } from 'src/app/components/evento-components/lista-mesas/lista-mesas.component';
import { ListaUbicacionesComponent } from 'src/app/components/evento-components/lista-ubicaciones/lista-ubicaciones.component';
import { MenuUbicacionComponent } from 'src/app/components/evento-components/menu-ubicacion/menu-ubicacion.component';
import { NombreEventoComponent } from 'src/app/components/evento-components/nombre-evento/nombre-evento.component';
import { TipoEventoComponent } from 'src/app/components/evento-components/tipo-evento/tipo-evento.component';
import { AuthGuard } from 'src/app/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'nombre',
    component: NombreEventoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tipo',
    component: TipoEventoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fechaHora',
    component: FechaHoraEventoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menuUbicacion',
    component: MenuUbicacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ubicaciones/:tipo',
    component: ListaUbicacionesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ubicaciones',
    component: ListaUbicacionesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ubicacion/:tipo',
    component: DetalleUbicacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'decoraciones',
    component: ListaDecoracionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menus',
    component: ListaMenusComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mesas',
    component: ListaMesasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mesa',
    component: DetalleMesaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'formMesa',
    component: FormMesaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'comensales',
    component: ListaComensalesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'formComensal',
    component: FormComensalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detallesPago',
    component: DetallesPagoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'eventos',
    component: ListaEventosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'evento',
    component: DetalleEventoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editar-evento',
    component: EditarEventoComponent,
    canActivate: [AuthGuard]
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoPageRoutingModule { }
