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
    return this.http.post<FighterDto>(url, entity).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAll(): Observable<FighterDto[]> {
    const url = `${this.baseUrl}/GetAll`;
    return this.http.get<FighterDto[]>(url).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllById(ids: string[]): Observable<FighterDto[]> {
    const params = ids.map((id) => `id=${id}`).join('&');
    const url = `${this.baseUrl}/GetAllById?${params}`;
    return this.http.get<FighterDto[]>(url).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<FighterDto> {
    const url = `${this.baseUrl}/GetById?id=${id}`;
    return this.http.get<FighterDto>(url).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  update(fighter: FighterDto): Observable<FighterDto> {
    const url = `${this.baseUrl}/Update`;
    return this.http.put<FighterDto>(url, fighter).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    const url = `${this.baseUrl}/Delete?id=${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.error) {
      // If the backend sends a string or an object
      errorMessage =
        typeof error.error === 'string'
          ? error.error
          : JSON.stringify(error.error);
    }

    console.error(`Error status: ${error.status} ===> ${errorMessage}`);
    return throwError(() => new Error(`${error.status}: ${errorMessage}`));
  }
}
