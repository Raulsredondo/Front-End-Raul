import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SubirService {
  readonly URL_API = 'http://localhost:3000/upload';





  constructor(private http: HttpClient) {

  }

  putImagen(tipo, id, img) {
      console.log(tipo)
      console.log(id)
      console.log(img)
      
    return this.http.put(this.URL_API + `/${tipo}/${id}`, img);
   

  }




};