import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../_environments/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CreateFighterDto, FighterDto } from './fighter';

@Injectable({
  providedIn: 'root',
})
export class FighterService {
  private baseUrl: string = API.fighter;
  private http = inject(HttpClient);

  add(entity: CreateFighterDto): Observable<FighterDto> {
    const url = `${this.baseUrl}/Add`;
    console.info(`sending POST request to: ${url}`);

    return this.http.post<FighterDto>(url, entity).pipe(
      map((response) => {
        console.info(`got response from ${url}`, response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAll(): Observable<FighterDto[]> {
    const url = `${this.baseUrl}/GetAll`;
    console.info(`sending GET request to: ${url}`);

    return this.http.get<FighterDto[]>(url).pipe(
      map((response) => {
        console.info(`got response from ${url}`, response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllById(ids: string[]): Observable<FighterDto[]> {
    const params = ids.map((id) => `id=${id}`).join('&');
    const url = `${this.baseUrl}/GetAllById?${params}`;
    console.info(`sending GET request to: ${url}`);

    return this.http.get<FighterDto[]>(url).pipe(
      map((response) => {
        console.info(`got response from ${url}`, response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<FighterDto> {
    const url = `${this.baseUrl}/GetById?id=${id}`;
    console.info(`sending GET request to: ${url}`);

    return this.http.get<FighterDto>(url).pipe(
      map((response) => {
        console.info(`got response from ${url}`, response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  update(fighter: FighterDto): Observable<FighterDto> {
    const url = `${this.baseUrl}/Update`
    console.info(`sending PUT request to: ${url}`);

    return this.http.put<FighterDto>(url, fighter).pipe(
      map((response) => {
        console.info(`got response from ${url}`, response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    const url = `${this.baseUrl}/Delete?id=${id}`

    return this.http
      .delete<void>(url)
      .pipe(
        map((response) => console.info(`got response from ${url}`, response)),
        catchError(this.handleError));
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
