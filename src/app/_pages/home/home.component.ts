import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/_services/game.service';

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
  hasStarted: boolean;
  apiCall: any;
  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit(): void {
    this.apiCall = setInterval(() => {
      this.getGameStatus();
    }, 500);
  }

  getGameStatus(): void {
    this.gameService.getGameStatus()
      .subscribe((data) => {
        if (data.status > 0) {
          this.hasStarted = true;
          return;
        }

        this.hasStarted = false;
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  getStarted(): void {
    if (this.hasStarted) {
      alert('Sorry, the game has already started. Please wait for the game to finish and try again.');
      return;
    }

    clearInterval(this.apiCall);
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
