import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/components/home-components/home.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo:'/auth/login',
    pathMatch: 'full',  
    
  },
  {
    path: 'inicio',
    component: HomeComponent,
    //canActivate indicaremos aquellos guards creados 
    //los cuales podemos implementar lógica de seguridad
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
