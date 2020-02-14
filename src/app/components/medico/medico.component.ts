import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { HospitalesModel } from '../../models/hospitalees';
import { HospitalService } from '../../services/hospital/hospital.service'
import { UsuarioModel } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { MedicosModel } from '../../models/medicoo';
import { MedicosService } from '../../services/medico/medicos.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  usu: string;
  usuarios: UsuarioModel[];
  hospitales: HospitalesModel[];
  medico: MedicosModel = new MedicosModel();


  constructor(private auth: LoginService, private hospitalesService: HospitalService, private usuarioService: UsuarioService, private medicoService: MedicosService,
               private route: ActivatedRoute ) { 
                
               }

  ngOnInit() {
    
    this.usu = sessionStorage.getItem('user_id');
    const id = this.route.snapshot.paramMap.get('id');
        this.hospitalesService.getHospitales().subscribe( (resp) => {
          console.log(resp)
          this.hospitales = resp;
        });
    if ( id !== 'nuevo' ) {

      this.medicoService.getMedico( id )
        .subscribe( (resp: MedicosModel) => {
          this.medico = resp;
          this.medico._id = id;
          console.log(this.medico.hospital)
          this.hospitalesService.getHospital(this.medico.hospital).subscribe((resp: HospitalesModel) => {
            this.medico.hospitalNom = resp.nombre
            console.log(this.medico.hospitalNom);
            console.log(resp.nombre);
            (<HTMLSelectElement>document.getElementById("2")).value = resp.nombre;
          })
          
        });



    }

    

  }



  logout(){
    this.auth.logout();
  };

  guardar( form: NgForm ) {
    var inputValue = (<HTMLSelectElement>document.getElementById("hola")).value;
    console.log(inputValue)
    console.log(form.value)
    if ( form.invalid ) {
      console.log('Formulario no válido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false
    });
    Swal.showLoading();


    let peticion: Observable<any>;

    if ( this.medico._id ) {
      this.medico.usuario = this.usu;
      this.medico.hospital = inputValue;
      peticion = this.medicoService.putMedicos( this.medico );
    } else {
      this.medico.usuario = this.usu;
      this.medico.hospital = inputValue;
      peticion = this.medicoService.postMedicos( this.medico );
    }

    peticion.subscribe( resp => {

      Swal.fire({
        title: this.medico.nombre,
        text: 'Se actualizó correctamente',
    
      });

    });



  }

}
