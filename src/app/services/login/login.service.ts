import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class LoginService {
  readonly URL_API = 'http://localhost:3000/login';
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{token: string, id: string}>(this.URL_API, {email: email, password: password})
      .pipe(
        map(result => {
          sessionStorage.setItem('access_token', result.token);
          sessionStorage.setItem('user_id', result.id);
          return true;
        })
      );
  }

  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_id');
  }

  public get loggedIn(): boolean {
    return (sessionStorage.getItem('access_token') !== null && sessionStorage.getItem('user_id') !== null);
    
  }
}
