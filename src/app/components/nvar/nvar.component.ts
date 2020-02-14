import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-nvar',
  templateUrl: './nvar.component.html',
  styleUrls: ['./nvar.component.css']
})
export class NvarComponent implements OnInit {


  prueba: string = sessionStorage.getItem('access_token');
  prueba2: string = null;
  constructor(private auth: LoginService) { }

  ngOnInit() {
  }

  logout(){
    this.auth.logout();
  }

}
