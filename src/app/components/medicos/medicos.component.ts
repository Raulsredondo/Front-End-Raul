import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HospitalesModel } from '../../models/hospitalees';
import { HospitalService } from '../../services/hospital/hospital.service';
import { UsuarioModel } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { MedicosModel } from '../../models/medicoo';
import { MedicosService } from '../../services/medico/medicos.service'
import { map, delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { from } from 'rxjs';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {

  medicos: MedicosModel[];
  medico: MedicosModel;
  hospital: HospitalesModel;
  usuario: UsuarioModel;
  filterPost = '';
  cargando = false;



  constructor(private auth: LoginService, private hospitalesService: HospitalService, private usuarioService: UsuarioService, private medicoService: MedicosService) { }

  ngOnInit() {
    var medico: MedicosModel;
    this.medicoService.getMedicos().subscribe(medicos => {


      medicos.forEach((medico: MedicosModel) => {

        this.usuarioService.getUsuario(medico.usuario).subscribe(
          (usuario: UsuarioModel) => {

            medico.usuarioEma = usuario.email
            this.medicos = medicos

          }
        );
        this.hospitalesService.getHospital(medico.hospital).subscribe(
          (hospital: HospitalesModel) => {
            if (hospital === undefined) {
              medico.hospitalNom = 'tuputamadre'
            } else {
              medico.hospitalNom = hospital.nombre
              this.medicos = medicos
            }


          });

      });
    });

  }

  hola() {
    this.medicos.forEach((medico: MedicosModel) => {
      console.log(medico)

    });
    console.log(this.medicos)
  }



  info(medico: HospitalesModel) {
    Swal.fire({
      title: medico.nombre,
      text: "Usuario que lo ha creado: " + medico.usuNom + " Email: " + medico.usuEma,
      imageUrl: medico.img,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
  };







  borrarMedico(medico: HospitalesModel, i: number) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${medico.nombre}`,
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {

      if (resp.value) {
        this.medicos.splice(i, 1);
        this.medicoService.deleteMedicos(medico._id).subscribe();
      }

    });



  }

  logout(){
    this.auth.logout();
  };
  

  private crearArreglo(hospitalesObj: object) {

    const medicos: HospitalesModel[] = [];

    Object.keys(hospitalesObj).forEach(Key => {

      const medico: HospitalesModel = hospitalesObj[Key];
      medico._id = Key;

      this.medicos = Object.values(medico)
    });


    return medicos;

  }


}