import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IBingoNumber, IGameStatus } from 'src/app/_interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  url = `${environment.url}/game`;
  constructor(
    private http: HttpClient,
  ) { }

  getGameStatus(): Observable<IGameStatus> {
    return this.http.get<IGameStatus>(`${this.url}/status`);
  }

  getBingoNumbers(): Observable<IBingoNumber[]> {
    return this.http.get<IBingoNumber[]>(`${this.url}/number`);
  }

  updateGameStatus(payload: { status: number, endgame: number }): Observable<void> {
    return this.http.put<void>(`${this.url}/status`, payload);
  }

  addBingoNumber(payload: IBingoNumber): Observable<IBingoNumber> {
    return this.http.post<IBingoNumber>(`${this.url}/number`, payload);
  }

  deleteBingoNumbers(): Observable<void> {
    return this.http.delete<void>(`${this.url}/number`);
  }
}
