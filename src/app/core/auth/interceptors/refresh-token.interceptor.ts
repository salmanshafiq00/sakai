import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Injectable, inject } from "@angular/core";

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor{

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


authService: AuthService = inject(AuthService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        console.error(error);
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.authService.isAuthenticated) {
          return this.handleTokenExpiration(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleTokenExpiration(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((authResponse) => {
          this.isRefreshing = false;
          this.authService.setAccessToken(authResponse.accessToken);
          this.refreshTokenSubject.next(authResponse.accessToken);
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authResponse.accessToken}`
            },
          });
          return next.handle(request);
        }),
        catchError((refreshError: any) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => refreshError);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            },
          });
          return next.handle(request);
        })
      );
    }
  }
}