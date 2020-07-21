
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth/shared/auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from './auth/login/login-response-payload';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn:'root'
})

export class TokenInterceptor implements HttpInterceptor{

  isTokenRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(public authService:AuthService){

  }

  intercept(req :HttpRequest<any>,next: HttpHandler):Observable<HttpEvent<any>>{
    const jwtToken=this.authService.getJwtToken();
    console.log('Token intercepter',jwtToken);
    if(jwtToken){
      console.log('Token intercepter',jwtToken)
      this.addToken(req,jwtToken);
    }

    return next.handle(req).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse
          && error.status === 403) {
          return this.handleAuthErrors(req, next);
      } else {
          return throwError(error);
      }
  }));
  }
  private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isTokenRefreshing) {
        this.isTokenRefreshing = true;
        this.refreshTokenSubject.next(null);

        return this.authService.refreshToken().pipe(
            switchMap((refreshTokenResponse: LoginResponse) => {
                this.isTokenRefreshing = false;
                this.refreshTokenSubject.next(refreshTokenResponse.authenticationToken);
                return next.handle(this.addToken(req, refreshTokenResponse.authenticationToken));
            })
        )
    }
}
  private addToken(req: HttpRequest<any>, jwtToken: string) {
    console.log('Token intercepter addToken()',jwtToken)
    return req.clone({
        headers: req.headers.set('Authorization',
            'Bearer ' + jwtToken)
    });
}
}
