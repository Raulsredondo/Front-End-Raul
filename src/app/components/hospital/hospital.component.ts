import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { HospitalesModel } from '../../models/hospitalees';
import { HospitalService } from '../../services/hospital/hospital.service'
import { UsuarioModel } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { LoginService } from '../../services/login/login.service';
import { ImagenesService } from '../../services/imagenes/imagenes.service';
import { SubirService } from '../../services/subir/subir.service';



import Swal from 'sweetalert2';
import { SubirArchivoService } from 'src/app/services/subir-archivo/subir-archivo.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {

  usu: string;
  usuarios: UsuarioModel[];
  hospital: HospitalesModel = new HospitalesModel();
  img: string;

  i: File = null;
  imageSrc: string;
  constructor(private subir: SubirService,  private auth: LoginService, private hospitalesService: HospitalService, private usuarioService: UsuarioService,
               private route: ActivatedRoute, public _subirArchivoService: SubirArchivoService ) { 
                
               }


  ngOnInit() {
    
    this.usu = sessionStorage.getItem('user_id');
    const id = this.route.snapshot.paramMap.get('id');
    this.img= sessionStorage.getItem('user_img');
    if ( id !== 'nuevo' ) {

      this.hospitalesService.getHospital( id )
        .subscribe( (resp: HospitalesModel) => {
          this.hospital = resp;
          this.hospital._id = id;
        });

    }
    

  }
  

  logout(){
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
      this.hospital.img = this.URLPublica;
      peticion = this.hospitalesService.putHospitales( this.hospital );
    } else {
      this.hospital.usuario = this.usu;
      this.hospital.img = this.URLPublica;
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
