import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { UsuarioModel } from '../../models/usuario';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuario: UsuarioModel;

  usuarios: UsuarioModel[];
  constructor(private usuService: UsuarioService,  private route: ActivatedRoute) { }

  ngOnInit() {
    var usu = sessionStorage.getItem('user_id');


    this.usuService.getUsuarios().subscribe((res: UsuarioModel[]) => {

      this.usuarios = res

    })
    this.usuService.getUsuario(usu).subscribe((res: UsuarioModel) => {

      this.usuario = res;
      this.usuario.password = '********';
    })
  }


}
