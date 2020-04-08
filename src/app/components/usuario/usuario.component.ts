import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { UsuarioModel } from '../../models/usuario';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import sha256 from 'crypto-js/sha256';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {




  encPassword: string = 'hola';


  imagen: File;

  imageSrc: string = "";


  usuario2: UsuarioModel = new UsuarioModel();
  usuario: UsuarioModel = new UsuarioModel();
  usuarios: UsuarioModel[];
  tu: Boolean;
  dos: string;
  uno: string;
  constructor(private auth: LoginService, public _subirArchivoService: SubirArchivoService, private usuService: UsuarioService, private route: ActivatedRoute) { }

  ngOnInit() {
    var usuId = sessionStorage.getItem('user_id');
    this.usuario2._id = sessionStorage.getItem('user_id');
    this.usuario2.email = sessionStorage.getItem('user_ema');
    this.usuario2.nombre = sessionStorage.getItem('user_nom');

    this.usuario2.img = sessionStorage.getItem('user_img');
    this.dos = sessionStorage.getItem('role');
    console.log(this.usuario2)

    var U2FsdGVkX19dhuQ1ASDIeXY9bGZSGoNMlHn9UkYt9o8 = '';


    if (sessionStorage.getItem('role') === 'ADMIN_ROLE') {
      console.log('true..........')
      this.tu = true;
    }

    this.tabla();

  }





  tabla() {

    this.usuService.getUsuarios().subscribe((res: UsuarioModel[]) => {

      this.usuarios = res

    })

  }

  borrarUsuario(usuario: UsuarioModel, i: number) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${usuario.nombre}`,
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {

      if (resp.value) {
        this.usuarios.splice(i, 1);
        this.usuService.deleteUsuarios(usuario._id).subscribe();
      }

    });
  }
  logout() {
    this.auth.logout();
  };

  guardarEDIT(form: NgForm) {

    if (form.invalid) {
      Swal.fire({
        title: 'Opssss',
        text: 'Formulario no valido',
        allowOutsideClick: false
      });
      return;
    }

    let peticion: Observable<any>;
    console.log(sha256(this.usuario2.password));
    this.usuario2.password = sha256(this.usuario2.password)
    this.usuario2.role = this.dos;
    this.usuario2.img = this.URLPublica;
    peticion = this.usuService.putUsuarios(this.usuario2);
    console.log(this.usuario2)

    peticion.subscribe(resp => {

      console.log(resp)
      Swal.fire({
        title: this.usuario2.nombre,
        text: 'Se actualizó correctamente',

      });

    },
    err => {
      console.log('HTTP Error', err.error.errors.errors.email.message)
      Swal.fire({
        title: this.usuario2.nombre,
        text: err.error.errors.errors.email.message,
      });
    });


  }

 


  subirImagen() {

    this._subirArchivoService.UploadFile(this.imagen, 'usuarios', this.usuario2._id).subscribe(resp => {
      console.log(resp)
    })


  }


  public filesToUpload;
  public resultUpload;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    fileInput.target.files;
    console.log(this.filesToUpload);
  }


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




  guardarADD(form: NgForm) {

    if (form.invalid) {
      Swal.fire({
        title: 'Opssss',
        text: 'Formulario no valido',
        allowOutsideClick: false
      });
      return;
    }

    if (form.value.password.lenght < 6) {
      Swal.fire({
        title: 'Opssss',
        text: 'Formulario no valido',
        allowOutsideClick: false
      });
      return;
    }

    this.usuario.password = sha256(this.usuario.password).toString()
    let peticion: Observable<any>;
    this.usuario.role = this.uno;
    this.usuario.img = this.URLPublica;

    peticion = this.usuService.postUsuarios(this.usuario);

    console.log(this.usuario)

    peticion.subscribe(resp => {

   

      Swal.fire({
        title: resp,
        text: 'Se actualizó correctamente',
      });

      this.usuService.getUsuarios().subscribe((res: UsuarioModel[]) => {
        this.usuarios = res
        
      })

      Swal.fire({
        title: this.usuario.nombre,
        text: 'Se actualizó correctamente',
      });

    },
      err => {
        console.log('HTTP Error', err.error.errors.errors.email.message)
        Swal.fire({
          title: this.usuario.nombre,
          text: err.error.errors.errors.email.message,
        });
      }
    );


  }



}

