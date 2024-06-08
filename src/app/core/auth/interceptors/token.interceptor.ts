import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor{
  
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken = this.authService.getAccessToken();
    
    if(accessToken){
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      return next.handle(clonedRequest);
    } else {
      this.router.navigate(['/login']);
    }
    return next.handle(req);
  }
}