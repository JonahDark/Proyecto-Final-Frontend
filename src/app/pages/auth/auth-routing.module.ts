import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/auth-components/login/login.component';
import { RegisterComponent } from 'src/app/components/auth-components/register/register.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',    
  },
  {
    path: 'login',
    component: LoginComponent,    
  },
  {
    path: 'register',
    component: RegisterComponent,    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
