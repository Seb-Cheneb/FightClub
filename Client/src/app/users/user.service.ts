import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../_environments/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ChangeRoleRequest, User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = API.user;
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    const URL = `${this.baseUrl}/GetUsers`;
    return this.http.get<User[]>(URL).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

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
