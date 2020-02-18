import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../../models/usuario';
import { map, delay } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Key } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 




  usuario: UsuarioModel;
  readonly URL_API = 'http://localhost:3000/usuario';
   httpOptions : any    = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*'
    })
  };
  prueba:string = sessionStorage.getItem('access_token');

  constructor(private http: HttpClient) {

  }

  postUsuarios(usuarios: UsuarioModel) {
    return this.http.post(this.URL_API+'?token='+this.prueba, usuarios);
  }
    
    

  getUsuarios() {
    return this.http.get(this.URL_API) 
    .pipe(
      map( this.crearArreglo ),
      delay(0)
    );
  }

  getUsuario(id: string){

    return  this.http.get(this.URL_API+ `/${id}`);
  }

  putUsuarios(usuarios: UsuarioModel) {
    return this.http.put(this.URL_API + `/${usuarios._id}`+'?token='+this.prueba, usuarios);
  }

  deleteUsuarios(id: string) {
    return this.http.delete(this.URL_API + `/${id}`+'?token='+this.prueba,);
  }


 private crearArreglo( usuariosObj: object ) {

    const usuarios: UsuarioModel[] = [];
    
    

    var hola = Object.keys( usuariosObj ).forEach( Key => {
      
      const usuario: UsuarioModel[] = usuariosObj[Key];
      console.log(usuario)
      for (let hospita of usuario) {
        // 1, "string", false
      usuarios.push( hospita );
      }
     
      
    });
    


    return usuarios;

  }
}