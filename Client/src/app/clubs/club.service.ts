import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../_environments/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ClubDto, CreateClubDto } from './club';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  private baseUrl: string = API.club;
  private http = inject(HttpClient);

  add(entity: CreateClubDto): Observable<ClubDto> {
    const url = `${this.baseUrl}/Add`;
    return this.http.post<ClubDto>(url, entity).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAll(): Observable<ClubDto[]> {
    return this.http.get<ClubDto[]>(`${this.baseUrl}/GetAll`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllById(ids: string[]): Observable<ClubDto[]> {
    const params = ids.map((id) => `id=${id}`).join('&');
    return this.http
      .get<ClubDto[]>(`${this.baseUrl}/GetAllById?${params}`)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getById(id: string): Observable<ClubDto> {
    return this.http.get<ClubDto>(`${this.baseUrl}/GetById?id=${id}`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getByUserId(id: string): Observable<ClubDto> {
    return this.http.get<ClubDto>(`${this.baseUrl}/GetByUserId?id=${id}`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  update(clubId: string, name: string): Observable<ClubDto> {
    return this.http
      .put<ClubDto>(
        `${this.baseUrl}/Update?clubId=${clubId}&name=${name}`,
        null
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/Delete?id=${id}`)
      .pipe(catchError(this.handleError));
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
