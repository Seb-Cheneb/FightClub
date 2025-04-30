import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../_environments/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CreateCompetitionDto, CompetitionDto } from './competition';

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  private baseUrl: string = API.competition;
  private http = inject(HttpClient);

  add(entity: CreateCompetitionDto): Observable<CompetitionDto> {
    return this.http.post<CompetitionDto>(`${this.baseUrl}/Add`, entity).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAll(): Observable<CompetitionDto[]> {
    return this.http.get<CompetitionDto[]>(`${this.baseUrl}/GetAll`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllById(ids: string[]): Observable<CompetitionDto[]> {
    const params = ids.map((id) => `id=${id}`).join('&');
    return this.http
      .get<CompetitionDto[]>(`${this.baseUrl}/GetAllById?${params}`)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getById(id: string): Observable<CompetitionDto> {
    return this.http
      .get<CompetitionDto>(`${this.baseUrl}/GetById?id=${id}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  update(fighter: CompetitionDto): Observable<CompetitionDto> {
    return this.http
      .put<CompetitionDto>(`${this.baseUrl}/Update`, fighter)
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

  addFighter(
    competitionId: string,
    fighterId: string
  ): Observable<CompetitionDto> {
    return this.http
      .get<CompetitionDto>(
        `${this.baseUrl}/AddFighter?competitionId=${competitionId}&fighterId=${fighterId}`
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  removeFighter(
    competitionId: string,
    fighterId: string
  ): Observable<CompetitionDto> {
    return this.http
      .get<CompetitionDto>(
        `${this.baseUrl}/RemoveFighter?competitionId=${competitionId}&fighterId=${fighterId}`
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  isFighterInCompetition(
    competitionId: string,
    fighterId: string
  ): Observable<boolean> {
    const api: string = `IsFighterInCompetition&competitionId=${competitionId}&fighterId=${fighterId}`;
    return this.http.get<boolean>(`${this.baseUrl}/${api}`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
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
