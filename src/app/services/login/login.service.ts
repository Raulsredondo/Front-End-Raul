import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class LoginService {
  readonly URL_API = 'http://localhost:3000/login';
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{token: string, id: string, role: string, email: string, nombre: string, password: string, img: string}>(this.URL_API, {email: email, password: password})
      .pipe(
        map(result => {
          console.log(result)
          sessionStorage.setItem('access_token', result.token);
          sessionStorage.setItem('user_id', result.id);
          sessionStorage.setItem('role', result.role);
          sessionStorage.setItem('user_nom', result.nombre);
          sessionStorage.setItem('user_ema', result.email);
          sessionStorage.setItem('user_pass', result.password);
          sessionStorage.setItem('user_img', result.img);
          return true;
        })
      );
  }

  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user_nom');
    sessionStorage.removeItem('user_ema');
    sessionStorage.removeItem('user_pass');
  }

  public get loggedIn(): boolean {
    return (sessionStorage.getItem('access_token') !== null && sessionStorage.getItem('user_id') !== null && sessionStorage.getItem('role') !== null);
    
  }
}
