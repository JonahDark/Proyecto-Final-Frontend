import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
import { NotFoundComponent } from './components/not-found-component/not-found/not-found.component';




registerLocaleData(localeEs);


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: [RouteReuseStrategy, LOCALE_ID],
      useValue: 'es-ES',
      useClass: IonicRouteStrategy
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
