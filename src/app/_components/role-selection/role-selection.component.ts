import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { IUser } from 'src/app/_interfaces';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss'],
})
export class RoleSelectionComponent implements OnInit {
  @Output() roleSelection = new EventEmitter<string>();
  hasHost = false;
  apiCall: any;
  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.apiCall = setInterval(() => {
      this.getUsers();
    }, 1000);
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe((data) => {
        this.hasHost = data.some((user) => user.role === 'host');
      }, (error) => {
        alert(error.message);
      });
  }

  getUserRole(role: string): void {
    if (role === 'participant') {
      if (!this.hasHost) {
        alert('A game master has not yet started the game. Please wait for the game master to continue.');
        return;
      }

      clearInterval(this.apiCall);
      this.roleSelection.emit(role);
      return;
    }

    if (this.hasHost) {
      alert('Someone is already hosting a game. Please wait for the game to finish and try again.');
      return;
    }

    clearInterval(this.apiCall);
    this.roleSelection.emit(role);
  }

}
