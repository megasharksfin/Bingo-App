import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../_interfaces/iuser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = `${environment.url}/users`;
  participantList$ = new BehaviorSubject<string[]>([]);
  constructor(
    private http: HttpClient,
  ) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.url);
  }

  addUser(username: string, role: string): Observable<IUser> {
    return this.http.post<IUser>(this.url, { username, role });
  }

  hasBingo(userId: number, isBingo: number): Observable<void> {
    return this.http.put<void>(`${this.url}/${userId}/isBingo`, { isBingo });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${userId}`);
  }

  deleteAllUsers(): Observable<void> {
    return this.http.delete<void>(this.url);
  }
}
