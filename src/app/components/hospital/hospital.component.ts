import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { HospitalesModel } from '../../models/hospitalees';
import { HospitalService } from '../../services/hospital/hospital.service'
import { UsuarioModel } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { LoginService } from '../../services/login/login.service';
import { ImagenesService } from '../../services/imagenes/imagenes.service';
import { SubirService } from '../../services/subir/subir.service';



import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {

  usu: string;
  usuarios: UsuarioModel[];
  hospital: HospitalesModel = new HospitalesModel();

  img: File = null;
  constructor(private subir: SubirService,  private auth: LoginService, private hospitalesService: HospitalService, private usuarioService: UsuarioService,
               private route: ActivatedRoute ) { 
                
               }


  ngOnInit() {
    
    this.usu = sessionStorage.getItem('user_id');
    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {

      this.hospitalesService.getHospital( id )
        .subscribe( (resp: HospitalesModel) => {
          this.hospital = resp;
          this.hospital._id = id;
        });

    }
    

  }
  guardarimg( ){

    let peticion = this.subir.putImagen('hospitales', this.hospital._id, this.img)

    peticion.subscribe( resp => {

      Swal.fire({
        title: this.hospital.nombre,
        text: 'Se actualizó correctamente',
    
      });

    });




    
  }

  logout(){
    this.auth.logout();
  };

  guardar( form: NgForm ) {
    console.log(form)
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

    if ( this.hospital._id ) {
      this.hospital.usuario = this.usu;
      peticion = this.hospitalesService.putHospitales( this.hospital );
    } else {
      this.hospital.usuario = this.usu;
      peticion = this.hospitalesService.postHospitales( this.hospital );
    }

    peticion.subscribe( resp => {

      Swal.fire({
        title: this.hospital.nombre,
        text: 'Se actualizó correctamente',
    
      });

    });



  }

}
