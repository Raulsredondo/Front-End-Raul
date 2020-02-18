import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { UsuarioModel } from '../../models/usuario';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import sha256 from 'crypto-js/sha256';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {




  encPassword: string = 'hola';






  usuario2: UsuarioModel = new UsuarioModel();
  usuario: UsuarioModel = new UsuarioModel();
  usuarios: UsuarioModel[];
  tu: Boolean;
  dos: string;
  uno: string;
  constructor(private auth: LoginService, private usuService: UsuarioService,  private route: ActivatedRoute) { }

  ngOnInit() {
    var usuId = sessionStorage.getItem('user_id');
    this.usuario2._id = sessionStorage.getItem('user_id');
    this.usuario2.email = sessionStorage.getItem('user_ema');
    this.usuario2.nombre = sessionStorage.getItem('user_nom');
   this.usuario2.password = sessionStorage.getItem('user_pass');
   this.dos = sessionStorage.getItem('role');
   console.log(this.usuario2)

   var U2FsdGVkX19dhuQ1ASDIeXY9bGZSGoNMlHn9UkYt9o8= '';

    
    if (sessionStorage.getItem('role') === 'ADMIN_ROLE') {
      console.log('true..........')
      this.tu =  true;
    }

    this.tabla();

  }





  tabla(){

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
  logout(){
    this.auth.logout();
  };

  guardarEDIT( form: NgForm ) {

    console.log(this.uno)
    


  
    if ( form.invalid ) {
      Swal.fire({
        title: 'Opssss',
        text: 'Formulario no valido',
        allowOutsideClick: false
      });
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false
    });
    Swal.showLoading();



  //  this.usuario2.password = CryptoJS.AES.encrypt(this.usuario2.password.trim(), this.encPassword.trim()).toString();
    



    let peticion: Observable<any>;

    console.log(sha256(this.usuario2.password));
    this.usuario2.password = sha256(this.usuario2.password)
      this.usuario2.role = this.dos;
      peticion = this.usuService.putUsuarios( this.usuario2 );
      console.log(this.usuario2)
  
    peticion.subscribe( resp => {


      Swal.fire({
        title: this.usuario.nombre,
        text: 'Se actualizó correctamente',
    
      });

    });


  }
 










  guardarADD( form: NgForm ) {
 
    



    if ( form.invalid ) {
      Swal.fire({
        title: 'Opssss',
        text: 'Formulario no valido',
        allowOutsideClick: false
      });
      return;
    }

    if ( form.value.password.lenght < 6 ) {
      Swal.fire({
        title: 'Opssss',
        text: 'Formulario no valido',
        allowOutsideClick: false
      });
      return;
    }

    

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false
    });
    Swal.showLoading();

    //this.usuario.password = CryptoJS.AES.encrypt(this.usuario.password.trim(), this.encPassword.trim()).toString();
   //decode= this.usuario.password = CryptoJS.AES.decrypt(this.usuario.password.trim(), this.encPassword.trim()).toString(CryptoJS.enc.Utf8);
   this.usuario.password = sha256(this.usuario.password).toString()
    let peticion: Observable<any>;

   
      this.usuario.role = this.uno;
    
      peticion = this.usuService.postUsuarios( this.usuario );
      console.log(this.usuario)
  
    peticion.subscribe( resp => {
      this.usuService.getUsuarios().subscribe((res: UsuarioModel[]) => {

        this.usuarios = res
  
      })

      Swal.fire({
        title: this.usuario.nombre,
        text: 'Se actualizó correctamente',
    
      });

    });


  }
 


}

