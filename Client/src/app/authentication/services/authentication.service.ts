import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../../_environments/api';
import {
  AuthenticationResponse,
  LoginRequest,
  RegistrationRequest,
} from '../models/authentication';

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

  get isLoggedIn(): boolean {
    return !!this.jwt;
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

  // getRole(id: string): Observable<String> {
  //   return this.http
  //     .get<String>(`${this.baseUrl}/getRole?id=${id}`)
  //     .pipe(catchError(this.handleError));
  // }

  // isAdmin(): Observable<boolean> {
  //   let id = this.cookieService.getUserId();
  //   if (id !== '') {
  //     return this.getRole(this.cookieService.getUserId()).pipe(
  //       map((role) => role === 'ADMIN'),
  //       catchError(this.handleError)
  //     );
  //   } else {
  //     return of(false);
  //   }
  // }

  // isModerator(): Observable<boolean> {
  //   let id = this.cookieService.getUserId();
  //   if (id !== '') {
  //     return this.getRole(this.cookieService.getUserId()).pipe(
  //       map((role) => role === 'MODERATOR'),
  //       catchError(this.handleError)
  //     );
  //   } else {
  //     return of(false);
  //   }
  // }

  // isAuthenticated() {
  //   return this.cookieService.checkToken();
  // }

  // getAuthToken() {
  //   return this.cookieService.getToken();
  // }

  // clearUser() {
  //   this.cookieService.removeCookies();
  // }

  /**
   * Handles errors that occur during HTTP requests.
   *
   * @param error - The error that occurred during the HTTP request.
   * @returns An Observable that emits an error.
   */
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
