import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventoPageRoutingModule } from './evento-routing.module';
import { EventoPage } from './evento.page';
import { HttpClientModule } from '@angular/common/http';
import { DetalleMesaComponent } from 'src/app/components/evento-components/detalle-mesa/detalle-mesa.component';
import { DetalleUbicacionComponent } from 'src/app/components/evento-components/detalle-ubicacion/detalle-ubicacion.component';
import { DetallesPagoComponent } from 'src/app/components/evento-components/detalles-pago/detalles-pago.component';
import { FechaHoraEventoComponent } from 'src/app/components/evento-components/fecha-hora-evento/fecha-hora-evento.component';
import { FormComensalComponent } from 'src/app/components/evento-components/form-comensal/form-comensal.component';
import { FormMesaComponent } from 'src/app/components/evento-components/form-mesa/form-mesa.component';
import { ListaComensalesComponent } from 'src/app/components/evento-components/lista-comensales/lista-comensales.component';
import { ListaDecoracionComponent } from 'src/app/components/evento-components/lista-decoracion/lista-decoracion.component';
import { ListaMenusComponent } from 'src/app/components/evento-components/lista-menus/lista-menus.component';
import { ListaMesasComponent } from 'src/app/components/evento-components/lista-mesas/lista-mesas.component';
import { ListaUbicacionesComponent } from 'src/app/components/evento-components/lista-ubicaciones/lista-ubicaciones.component';
import { MenuUbicacionComponent } from 'src/app/components/evento-components/menu-ubicacion/menu-ubicacion.component';
import { NombreEventoComponent } from 'src/app/components/evento-components/nombre-evento/nombre-evento.component';
import { TipoEventoComponent } from 'src/app/components/evento-components/tipo-evento/tipo-evento.component';
import { DetalleEventoComponent } from 'src/app/components/evento-components/detalle-evento/detalle-evento.component';
import { EditarEventoComponent } from 'src/app/components/evento-components/editar-evento/editar-evento.component';
import { ListaEventosComponent } from 'src/app/components/evento-components/lista-eventos/lista-eventos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    EventoPageRoutingModule
  ],
  declarations: [
    EventoPage,
    NombreEventoComponent,
    TipoEventoComponent,
    FechaHoraEventoComponent,    
    MenuUbicacionComponent,
    ListaDecoracionComponent,
    ListaUbicacionesComponent,
    DetalleUbicacionComponent,
    ListaMenusComponent,
    ListaMesasComponent,
    DetalleMesaComponent,
    ListaComensalesComponent,    
    EventoPage,
    FormMesaComponent,
    FormComensalComponent,
    DetallesPagoComponent,
    ListaEventosComponent,
    DetalleEventoComponent,
    EditarEventoComponent,
    
  ]
})
export class EventoPageModule {}
