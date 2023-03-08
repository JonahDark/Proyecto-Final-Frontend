import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { LoginComponent } from 'src/app/components/auth-components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from 'src/app/components/auth-components/register/register.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthPageRoutingModule,
  ],
  declarations: [
    AuthPage,
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthPageModule {}
