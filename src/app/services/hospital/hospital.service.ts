import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HospitalesModel } from '../../models/hospitalees';
import { map, delay } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Key } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  readonly URL_API = 'http://localhost:3000/hospital';
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

  postHospitales(hospitalees: HospitalesModel) {
    
    return this.http.post(this.URL_API+'?token='+this.prueba, hospitalees);
  }
    
    

  getHospitales() {

    return this.http.get(this.URL_API) 
    .pipe(
      map( this.crearArreglo ),
      delay(0)
    );

    
    
  }

  getHospital (id: string){
    return this.http.get(this.URL_API+ `/${id}`);
  }

  putHospitales(hospitalees: HospitalesModel) {
    return this.http.put(this.URL_API + `/${hospitalees._id}`+'?token='+this.prueba, hospitalees);
  }

  deleteHospitales(_id: string) {
    console.log(_id)
    _id.toString()
    console.log(_id)
     return this.http.delete(this.URL_API +  `/${_id}`+'?token='+this.prueba);
  }


  private crearArreglo( hospitalesObj: object ) {

    const hospitales: HospitalesModel[] = [];
    
    

    var hola = Object.keys( hospitalesObj ).forEach( Key => {
      
      const hospital: HospitalesModel[] = hospitalesObj[Key];
      console.log(hospital)
      for (let hospita of hospital) {
        // 1, "string", false
      hospitales.push( hospita );
      }
     
      
    });
    


    return hospitales;

  }
}