import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../_environments/api';
import {
  RegistrationRequest,
  AuthenticationResponse,
  LoginRequest,
} from './authentication';
import { ChangeRoleRequest, User } from '../users/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl: string = API.authentication;
  private http = inject(HttpClient);
  private static readonly key = 'JWT_KEY';
  private static readonly refreshToken = 'REFRESH_TOKEN';
  private static readonly expirationDate = 'EXPIRATION_DATE';
  private static readonly userId = 'USER_ID';
  private static readonly role = 'ROLE';

  get jwt(): string {
    return sessionStorage.getItem(AuthenticationService.key) ?? '';
  }

  private set jwt(value: string) {
    sessionStorage.setItem(AuthenticationService.key, value);
  }

  get refreshToken(): string {
    return sessionStorage.getItem(AuthenticationService.refreshToken) ?? '';
  }

  private set refreshToken(value: string) {
    sessionStorage.setItem(AuthenticationService.refreshToken, value);
  }

  get expirationDate(): string {
    return sessionStorage.getItem(AuthenticationService.expirationDate) ?? '';
  }

  private set expirationDate(value: string) {
    sessionStorage.setItem(AuthenticationService.expirationDate, value);
  }

  get userId(): string {
    return sessionStorage.getItem(AuthenticationService.userId) ?? '';
  }

  private set userId(value: string) {
    sessionStorage.setItem(AuthenticationService.userId, value);
  }

  get role(): string {
    return sessionStorage.getItem(AuthenticationService.role) ?? '';
  }

  private set role(value: string) {
    sessionStorage.setItem(AuthenticationService.role, value);
  }

  get isLoggedIn(): boolean {
    return !!this.jwt;
  }

  isModerator(): boolean {
    return this.role === 'Moderator';
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  register(entity: RegistrationRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.baseUrl}/Register`, entity)
      .pipe(
        tap((response) => {
          this.jwt = response.jwtToken;
          this.refreshToken = response.refreshToken;
          this.expirationDate = response.expirationDate;
          this.userId = response.userId;
          this.role = response.role;
        }),
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  login(entity: LoginRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.baseUrl}/Login`, entity)
      .pipe(
        tap((response) => {
          this.jwt = response.jwtToken;
          this.refreshToken = response.refreshToken;
          this.expirationDate = response.expirationDate;
          this.userId = response.userId;
          this.role = response.role;
        }),
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    sessionStorage.removeItem(AuthenticationService.key);
    sessionStorage.removeItem(AuthenticationService.refreshToken);
    sessionStorage.removeItem(AuthenticationService.expirationDate);
    sessionStorage.removeItem(AuthenticationService.userId);
  }

  changeRole(
    userId: string,
    changeRoleRquest: ChangeRoleRequest
  ): Observable<User> {
    return this.http
      .put<User>(`${this.baseUrl}/ChangeRole/${userId}`, changeRoleRquest)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
