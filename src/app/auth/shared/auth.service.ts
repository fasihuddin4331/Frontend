import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignUpRequestPayload } from '../signup/signup-request-payload';
import { Observable } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request-payload';
import { LoginResponse } from '../login/login-response-payload';
import { LocalStorageService } from 'ngx-webstorage';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  apiUrl="http://localhost:9090/api/auth/";

  constructor(private http:HttpClient,
    private localStorage:LocalStorageService) {

   }

  signup(signuprequestpayload:SignUpRequestPayload):Observable<any>{
    return this.http.post(this.apiUrl+'signup',signuprequestpayload,{responseType:'text'})
  }

  login(loginrequest:LoginRequestPayload):Observable<boolean>{
    return this.http.post<LoginResponse>(this.apiUrl+'login',loginrequest).
      pipe(map(data => {
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiredAt', data.expiredAt);
        return true;
      }));
  }

  refreshToken() {
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      username: this.getUserName()
    }
    return this.http.post<LoginResponse>(this.apiUrl+'refresh/token',
      refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.store('authenticationToken', response.authenticationToken);
        this.localStorage.store('expiredAt', response.expiredAt);
      }));
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }

  getExpirationTime() {
    return this.localStorage.retrieve('expiredAt');
  }
}
