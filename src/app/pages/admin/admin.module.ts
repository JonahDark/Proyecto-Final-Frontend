import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { ListaUsuariosComponent } from 'src/app/components/usuario-components/lista-usuarios/lista-usuarios.component';

import { HttpClientModule } from '@angular/common/http';
import { FormUbicacionComponent } from 'src/app/components/ubicacion-components/form-ubicacion/form-ubicacion.component';
import { FormDecoracionComponent } from 'src/app/components/decoracion-components/form-decoracion/form-decoracion.component';
import { FormMenuComponent } from 'src/app/components/menu-components/form-menu/form-menu.component';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminPageRoutingModule
  ],
  declarations: [
    AdminPage,
    ListaUsuariosComponent,
    FormUbicacionComponent,
    FormDecoracionComponent,
    FormMenuComponent
  ]

})
export class AdminPageModule { }
