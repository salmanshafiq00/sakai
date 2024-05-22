import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { AuthRouting, AuthRoutingComponents } from './auth-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { environment } from 'src/environments/environment';
import { API_BASE_URL, AccountsClient } from './services/auth-client.service';
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  declarations: [
    ...AuthRoutingComponents
  ],
  imports: [
    CommonModule
    , RouterModule
    , ButtonModule
    , CheckboxModule
    , InputTextModule
    , FormsModule
    , PasswordModule
    , AuthRouting
  ],
  providers: [
    AccountsClient,
    AuthService,
    {provide: API_BASE_URL, useValue: environment.API_BASE_URL},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true}
  ]
})
export class AuthModule { }


