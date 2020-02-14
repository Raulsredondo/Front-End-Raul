import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HospitalesModel } from '../../models/hospitalees';
import { HospitalService } from '../../services/hospital/hospital.service';
import { UsuarioModel } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { map, delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login/login.service';
import { ImagenesService } from '../../services/imagenes/imagenes.service';


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit {

  hospitales: HospitalesModel[];
  hospital: HospitalesModel;
  usuario: UsuarioModel;
  cargando = false;
  filterPost = '';
  collection = [];
  prueba: Object;


  constructor(private img: ImagenesService, private auth: LoginService, private hospitalesService: HospitalService, private usuarioService: UsuarioService) { 
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  ngOnInit() {

    this.img.getImagen("hospitales", '5e3c0a1d1b22d738ec3921ed-492.png').subscribe(res => {
      console.log(res)
      this.prueba = res
    });
    
    this.hospitalesService.getHospitales().subscribe(
      hospitales =>
        hospitales.forEach(resp => {
          var hospital: HospitalesModel;
          hospital = resp;
          console.log(resp._id)

          this.usuarioService.getUsuario(hospital.usuario).subscribe(
            (resp: UsuarioModel) => {
              this.usuario = resp;
           
              hospital.usuNom = resp.nombre
              hospital.usuEma = resp.email
              this.hospitales = hospitales
            }
          );

        })

        


    );

  };


  logout(){
    this.auth.logout();
  };


  info(hospital: HospitalesModel) {
    Swal.fire({
      title: hospital.nombre,
      text:"Usuario que lo ha creado: " + hospital.usuNom + " Email: " + hospital.usuEma,
      imageUrl: hospital.img,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
  };







  borrarHospital(hospital: HospitalesModel, i: number) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${hospital.nombre}`,
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {

      if (resp.value) {this.hospitalesService.deleteHospitales(hospital._id).subscribe();
        this.hospitales.splice(i, 1);
        
      }

    });



  }

  private crearArreglo(hospitalesObj: object) {

    const hospitales: HospitalesModel[] = [];

    Object.keys(hospitalesObj).forEach(Key => {

      const hospital: HospitalesModel = hospitalesObj[Key];
      hospital._id = Key;

      this.hospitales = Object.values(hospital)
    });


    return hospitales;

  }


}
