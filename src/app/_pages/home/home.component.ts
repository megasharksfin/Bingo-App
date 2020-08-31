import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  getStartedState = true;
  roleSelectionShown = false;
  enterUsername = false;
  usernameMessage: string;
  selectedRole: string;
  constructor() { }

  ngOnInit(): void {
  }

  getStarted(): void {
    this.roleSelectionShown = true;
    this.getStartedState = false;
  }

  roleSelection(role: string): void {
    this.selectedRole = role;
    this.enterUsername = true;
    this.roleSelectionShown = false;

    if (role === 'host') {
      this.usernameMessage = 'Hello, game master. Please enter your username below:';
      return;
    }

    this.usernameMessage = 'Hello, participant. Please enter your name below:';
  }

  back(): void {
    this.usernameMessage = '';
    this.enterUsername = false;
    this.roleSelectionShown = true;
  }

}
