import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  public username: string;
  public password: string;
  public error: string;

  constructor(private auth: LoginService, private router: Router) { }


  public submit() {
    this.auth.login(this.username, this.password)
      .pipe(first())
      .subscribe(
        result => {
          if(result == true){
            this.router.navigate(['hospitales'])
          }
          
        },
        err => {this.error = 'Email o Password incorrectos'
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: this.error,
          })
          
        }
        
      );
  }
  logout(){
    this.auth.logout();
  }
  hola(){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: '<a href>Why do I have this issue?</a>'
    })
  }
}
