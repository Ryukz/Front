import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  authenticate(username, password) {
    const headers = new HttpHeaders({
      Authorization: ' Basic ' + btoa(username + ':' + password)
    });

    return this.http
      .get('http://localhost:8080/login/loginUser', { headers })
      .pipe(
        map(data => {
          sessionStorage.setItem('token', btoa(username + ':' + password));
        })
      );
  }

  logoutService() {
    sessionStorage.removeItem('recent');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
  }

  addHeader() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: ' Basic ' + token });

    return headers;
  }
}
