import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalesComponent } from './components/hospitales/hospitales.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { MedicosComponent } from './components/medicos/medicos.component';
import { LoginComponent } from './components/login/login.component';
import { NvarComponent } from './components/nvar/nvar.component';

import { AuthGuard } from './Auth/auth.guard';
import { from } from 'rxjs';
import { MedicoComponent } from './components/medico/medico.component';

const routes: Routes = [
  { path: 'hospitales', component: HospitalesComponent, canActivate: [AuthGuard] },
  { path: 'hospital/:id', component: HospitalComponent, canActivate: [AuthGuard] },
  { path: 'medico/:id', component: MedicoComponent, canActivate: [AuthGuard] },
  { path: 'medicos', component: MedicosComponent, canActivate: [AuthGuard] },
  { path: 'nvar', component: NvarComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
