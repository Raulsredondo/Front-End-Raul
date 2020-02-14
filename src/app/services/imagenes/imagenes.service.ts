import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Key } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  readonly URL_API = 'http://localhost:3000/img';
   httpOptions : any    = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*'
    })
  };


  constructor(private http: HttpClient) {

  }

  getImagen(tipo, img) {
    return this.http.get(this.URL_API + '/'+tipo+'/'+img);
  }




}