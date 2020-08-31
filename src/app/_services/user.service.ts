import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  host = new BehaviorSubject<string>('');
  participantList = new BehaviorSubject<string[]>([]);
  constructor() { }

  addNewParticipant(username: string): void {
    this.participantList
      .next(this.participantList.getValue().concat([ username ]));
  }
}
