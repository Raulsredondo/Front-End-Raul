import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MedicosModel } from '../../models/medicoo';
import { map, delay } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Key } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
 
  readonly URL_API = 'http://localhost:3000/medico';
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

  postMedicos(medicos: MedicosModel) {
    
    return this.http.post(this.URL_API+'?token='+this.prueba, medicos);
  }
    
    

  getMedicos() {

    return this.http.get(this.URL_API) 
    .pipe(
      map( this.crearArreglo ),
      delay(0)
    );

    
    
  }

  getMedico(id: string){
    return this.http.get(this.URL_API+ `/${id}`);
  }

  putMedicos(medicos: MedicosModel) {
    return this.http.put(this.URL_API + `/${medicos._id}`+'?token='+this.prueba, medicos);
  }

  deleteMedicos(id: string) {
    return this.http.delete(this.URL_API + `/${id}`+'?token='+this.prueba);
  }


  private crearArreglo( hospitalesObj: object ) {

    const medicos: MedicosModel[] = [];
    
    

    var hola = Object.keys( hospitalesObj ).forEach( Key => {
      
      const medico: MedicosModel[] = hospitalesObj[Key];
  
      for (let medi of medico) {
        // 1, "string", false
      medicos.push( medi );
      }
     
      
    });
    


    return medicos;

  }
}