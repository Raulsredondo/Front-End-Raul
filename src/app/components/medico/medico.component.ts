import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HospitalesModel } from '../../models/hospitalees';
import { HospitalService } from '../../services/hospital/hospital.service'
import { UsuarioModel } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { MedicosModel } from '../../models/medicoo';
import { MedicosService } from '../../services/medico/medicos.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login/login.service';
import { SubirArchivoService } from 'src/app/services/subir-archivo/subir-archivo.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  img: string;
  usu: string;
  usuarios: UsuarioModel[];
  hospitales: HospitalesModel[];
  medico: MedicosModel = new MedicosModel();
  imageSrc: string;


  constructor(private auth: LoginService, private hospitalesService: HospitalService, private usuarioService: UsuarioService, private medicoService: MedicosService,
    private route: ActivatedRoute, public _subirArchivoService: SubirArchivoService) {

  }

  ngOnInit() {
    this.img = sessionStorage.getItem('user_img');
    this.usu = sessionStorage.getItem('user_id');
    const id = this.route.snapshot.paramMap.get('id');
    this.hospitalesService.getHospitales().subscribe((resp) => {
      console.log(resp)
      this.hospitales = resp;
    });
    if (id !== 'nuevo') {

      this.medicoService.getMedico(id)
        .subscribe((resp: MedicosModel) => {
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



  logout() {
    this.auth.logout();
  };






  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });
  public mensajeArchivo = 'No hay un archivo seleccionado';
  public datosFormulario = new FormData();
  public nombreArchivo = '';
  public URLPublica = '';
  public porcentaje = 0;
  public finalizado = false;

  //Evento que se gatilla cuando el input de tipo archivo cambia
  public cambioArchivo(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result as string;

      reader.readAsDataURL(file);
      for (let i = 0; i < event.target.files.length; i++) {
        this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
        this.nombreArchivo = event.target.files[i].name;
        this.datosFormulario.delete('archivo');
        this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name)
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  public subirArchivo() {
    let archivo = this.datosFormulario.get('archivo');
    let referencia = this._subirArchivoService.referenciaCloudStorage(this.nombreArchivo);
    let tarea = this._subirArchivoService.tareaCloudStorage(this.nombreArchivo, archivo);

    //Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {
      this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;
      }
    });

    referencia.getDownloadURL().subscribe((URL) => {
      this.URLPublica = URL;
      console.log(URL);

    });
  }










  guardar(form: NgForm) {
    var inputValue = (<HTMLSelectElement>document.getElementById("hola")).value;
    console.log(inputValue)
    console.log(form.value)
    if (form.invalid) {
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

    if (this.medico._id) {
      this.medico.usuario = this.usu;
      this.medico.hospital = inputValue;
      this.medico.img = this.URLPublica;
      peticion = this.medicoService.putMedicos(this.medico);
    } else {
      this.medico.usuario = this.usu;
      this.medico.hospital = inputValue;
      this.medico.img = this.URLPublica;
      peticion = this.medicoService.postMedicos(this.medico);
    }

    peticion.subscribe(resp => {

      Swal.fire({
        title: this.medico.nombre,
        text: 'Se actualizó correctamente',

      });

    });



  }

}
