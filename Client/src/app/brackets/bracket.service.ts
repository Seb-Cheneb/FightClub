import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../_environments/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BracketDto, CreateBracketDto } from './bracket';

@Injectable({
  providedIn: 'root',
})
export class BracketService {
  private baseUrl: string = API.bracket;
  private http = inject(HttpClient);

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
    return this.http
      .get<BracketDto[]>(`${this.baseUrl}/GetAllById?${params}`)
      .pipe(
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

  update(fighter: BracketDto): Observable<BracketDto> {
    return this.http.put<BracketDto>(`${this.baseUrl}/Update`, fighter).pipe(
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
      .put<BracketDto>(
        `${this.baseUrl}/SetFighterPosition?bracketId=${bracketId}&fighterId=${fighterId}&position=${position}`,
        null
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  removeFighterPosition(
    bracketId: string,
    fighterId: string,
    position: number
  ): Observable<BracketDto> {
    return this.http
      .put<BracketDto>(
        `${this.baseUrl}/RemoveFighterPosition?bracketId=${bracketId}&fighterId=${fighterId}&position=${position}`,
        null
      )
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
      errorMessage = `CLIENT ERROR: ${error.error.message}`;
    } else {
      errorMessage = `SERVER ERROR: ${error.status}\n: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
