import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from "@auth0/angular-jwt";
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { HospitalesComponent } from './components/hospitales/hospitales.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MedicosComponent } from './components/medicos/medicos.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './Auth/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/Token.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';





import { LoginService } from './services/login/login.service';
import { NvarComponent } from './components/nvar/nvar.component';
import { FilterPipe } from './pipes/filter.pipe';
import { MedicoComponent } from './components/medico/medico.component';
import { UsuarioComponent } from './components/usuario/usuario.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}


 

@NgModule({
  declarations: [
    AppComponent,
    HospitalComponent,
    HospitalesComponent,
    MedicosComponent,
    LoginComponent,
    NvarComponent,
    FilterPipe,
    MedicoComponent,
    UsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    NgxPaginationModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["http://localhost:3000/"],
        blacklistedRoutes: ['']
      }
    })

  ],
  providers: [
    LoginService,
    AuthGuard,
    {
    provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
