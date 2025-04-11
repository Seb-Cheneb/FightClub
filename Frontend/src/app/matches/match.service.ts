import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../_environments/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { MatchDto } from './match';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private baseUrl: string = API.match;
  private http = inject(HttpClient);

  add(competitionId: String): Observable<MatchDto> {
    return this.http
      .post<MatchDto>(
        `${this.baseUrl}/Add?competitionId=${competitionId}`,
        null
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getAll(): Observable<MatchDto[]> {
    return this.http.get<MatchDto[]>(`${this.baseUrl}/GetAll`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllById(ids: string[]): Observable<MatchDto[]> {
    const params = ids.map((id) => `id=${id}`).join('&');
    return this.http
      .get<MatchDto[]>(`${this.baseUrl}/GetAllById?${params}`)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getById(id: string): Observable<MatchDto> {
    return this.http
      .get<MatchDto>(`${this.baseUrl}/GetById?matchId=${id}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  update(fighter: MatchDto): Observable<MatchDto> {
    return this.http.put<MatchDto>(`${this.baseUrl}/Update`, fighter).pipe(
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

  addFighter(matchId: string, fighterId: string): Observable<MatchDto> {
    return this.http
      .put<MatchDto>(
        `${this.baseUrl}/AddFighter?matchId=${matchId}&fighterId=${fighterId}`,
        null
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  removeFighter(matchId: string, fighterId: string): Observable<MatchDto> {
    var url: string = `${this.baseUrl}/RemoveFighter?matchId=${matchId}&fighterId=${fighterId}`;
    console.info(`Sending DELETE request to ${url}`);

    return this.http.put<MatchDto>(url, null).pipe(
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
