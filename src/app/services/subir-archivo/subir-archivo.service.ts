import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Key } from 'protractor';
import { resolve } from 'dns';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable()
export class SubirArchivoService {


  readonly URL_API = 'http://localhost:3000';
  constructor(private _http: HttpClient, 
    private storage: AngularFireStorage) { }




      //Tarea para subir archivo
      tareaCloudStorage(nombreArchivo: string, datos: any) {
        return this.storage.upload(nombreArchivo, datos);
      }
      
    
      //Referencia del archivo
      referenciaCloudStorage(nombreArchivo: string) {
        return this.storage.ref(nombreArchivo);
      }


  UploadFile(fileToUpload: File, tipo: string, id: string ){
    const endpoint = this.URL_API + '/upload/' + tipo + '/' + id;;
    var formData = new FormData();
    formData.set('file', fileToUpload);
    formData
    return this._http.put(endpoint, formData);
  }



hola(files: Array<File>){
  return new Promise ((resolve, reject)=>{
    var formData: any = new FormData();
    var xhr = new XMLHttpRequest();

    for (let i = 0; i < files.length; i++) {
      formData.append('uploads[]', files[i], files[i].name);
      
    }

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          resolve(JSON.parse(xhr.response));
        }else{
          reject(xhr.response);
        }
      }
    }

    xhr.open("put", this.URL_API, true);
    xhr.send(formData);
  });
}




  subirArchivo( archivo: File, tipo: string, id: string ) {

    

    return new Promise( (resolve, reject ) => {

      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append( 'imagen', archivo.name);
      console.log(archivo, tipo, id)
      xhr.onreadystatechange = function() {

        if ( xhr.readyState === 4 ) {

          if ( xhr.status === 200 ) {
            console.log( 'Imagen subida' );
            resolve( JSON.parse( xhr.response ) );
          } else {
            console.log( 'Fallo la subida' );
            reject( xhr.response );
          }

        }
      };

      let url = this.URL_API + '/upload/' + tipo + '/' + id;

      xhr.open('PUT', url, true );
      xhr.send( formData );
      

    });




  }

}
