import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AccountsClient, AuthenticatedResponse, LoginRequestCommand } from './auth-client.service';
import { er } from '@fullcalendar/core/internal-common';


const access_token = 'access_token';

@Injectable()
export class AuthService {

  isAuthenticated: boolean = false;
  redirectUrl: string | null = null;

  private accountsClient: AccountsClient = inject(AccountsClient);

  // login(loginRequest: LoginRequestCommand): Observable<boolean> {
  //   return new Observable<boolean>((observer) => {
  //     this.accountsClient.login(loginRequest).subscribe({
  //       next: (authResponse) => {
  //         console.log(authResponse);
  //         if (!authResponse) {
  //           observer.next(false);
  //         }
  //         else {
  //           localStorage.setItem(access_token, `${authResponse.accessToken}`);
  //           this.isAuthenticated = true;
  //           observer.next(false);
  //         }
  //       },
  //       error: (error) => {
  //         console.error(`login error`, error);
  //         observer.error(error);
  //       }
  //     });
  //   });
  // }

  login(loginRequest: LoginRequestCommand): Observable<boolean> {
    return this.accountsClient.login(loginRequest).pipe(
      tap((res) => {
        console.log(res);
      }),
      map((response) => {
        if(!response){
          return false;
        }
        else{
          localStorage.setItem(access_token, `${response.accessToken}`);
          this.isAuthenticated = true;
          return true;
        }
      }),
      catchError((err) => {
        console.error(`error while login`, err);
        return of(false);
      })
    );
  }

  logout() {

  }

  refreshToken(): Observable<AuthenticatedResponse> {
    return this.accountsClient.refreshToken()
      .pipe(
        map((authResponse) => {
          localStorage.setItem(access_token, `${authResponse.accessToken}`);
          return authResponse;
        }),
        catchError((error) => {
          console.error(`Error refresh token`, error);
          return of(error);
        }));
  }



  getAccessToken(): string | null {
    return localStorage.getItem(access_token);;
  }

  setAccessToken(value: string) {
    localStorage.setItem(access_token, value);;
  }

  clearAccessToken(): void {
    localStorage.removeItem(access_token);
  }
}
