import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../_environments/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BracketDto, CreateBracketDto, PositionDto } from './bracket';
import { CompetitionDto } from '../competitions/competition';

@Injectable({
  providedIn: 'root',
})
export class BracketService {
  private baseUrl: string = API.bracket;
  private http = inject(HttpClient);
  private class = 'BracketService ::';

  add(entity: CreateBracketDto): Observable<BracketDto> {
    const url = `${this.baseUrl}/Add`;
    return this.http.post<BracketDto>(url, entity).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAll(): Observable<BracketDto[]> {
    return this.http.get<BracketDto[]>(`${this.baseUrl}/GetAll`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllById(ids: string[]): Observable<BracketDto[]> {
    const params = ids.map((id) => `id=${id}`).join('&');
    const URL = `${this.baseUrl}/GetAllById?${params}`;
    console.info(
      `BracketService :: getAllById(${ids}) ===> sending the request to ${URL}`
    );
    return this.http.get<BracketDto[]>(URL).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<BracketDto> {
    return this.http
      .get<BracketDto>(`${this.baseUrl}/GetById?bracketId=${id}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  update(bracketId: string, surface: string): Observable<BracketDto> {
    return this.http
      .put<BracketDto>(
        `${this.baseUrl}/Update?bracketId=${bracketId}&surface=${surface}`,
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

  addFighter(bracketId: string, fighterId: string): Observable<BracketDto> {
    return this.http
      .put<BracketDto>(
        `${this.baseUrl}/AddFighter?bracketId=${bracketId}&fighterId=${fighterId}`,
        null
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  removeFighter(bracketId: string, fighterId: string): Observable<BracketDto> {
    var url: string = `${this.baseUrl}/RemoveFighter?bracketId=${bracketId}&fighterId=${fighterId}`;
    return this.http.put<BracketDto>(url, null).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  setFighterPosition(
    bracketId: string,
    fighterId: string,
    position: number
  ): Observable<BracketDto> {
    return this.http
      .post<BracketDto>(
        `${this.baseUrl}/SetFighterPosition?bracketId=${bracketId}&fighterId=${fighterId}&position=${position}`,
        null
      )
      .pipe(
        map((response) => {
          console.info(
            `${this.class} setFighterPosition(bracketId: ${bracketId}, fighterId: ${fighterId}, position: ${position}) -- got the following response`,
            response
          );
          return response;
        }),
        catchError(this.handleError)
      );
  }

  removePosition(bracketId: string, position: number): Observable<BracketDto> {
    return this.http
      .post<BracketDto>(
        `${this.baseUrl}/RemovePosition?bracketId=${bracketId}&position=${position}`,
        null
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getPositions(bracketId: string): Observable<PositionDto[]> {
    return this.http
      .get<PositionDto[]>(`${this.baseUrl}/GetPositions?bracketId=${bracketId}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  isFighterEnrolledInKata(
    competitionId: string,
    fighterId: string
  ): Observable<boolean> {
    const api: string = `IsFighterEnrolledInKata&competitionId=${competitionId}&fighterId=${fighterId}`;
    return this.http.get<boolean>(`${this.baseUrl}/${api}`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  isFighterEnrolledInKumite(
    competitionId: string,
    fighterId: string
  ): Observable<boolean> {
    const api: string = `IsFighterEnrolledInKumite&competitionId=${competitionId}&fighterId=${fighterId}`;
    return this.http.get<boolean>(`${this.baseUrl}/${api}`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  enrollFighter(
    competitionId: string,
    fighterId: string,
    bracketType: string
  ): Observable<CompetitionDto> {
    const url = `${this.baseUrl}/EnrollFighter?competitionId=${competitionId}&fighterId=${fighterId}&bracketType=${bracketType}`;
    return this.http.post<CompetitionDto>(url, null).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  unEnrollFighter(
    competitionId: string,
    fighterId: string,
    bracketType: string
  ): Observable<CompetitionDto> {
    const url = `${this.baseUrl}/UnEnrollFighter?competitionId=${competitionId}&fighterId=${fighterId}&bracketType=${bracketType}`;
    return this.http.post<CompetitionDto>(url, null).pipe(
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
