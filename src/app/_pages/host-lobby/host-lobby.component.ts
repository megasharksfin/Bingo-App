import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { IUser } from 'src/app/_interfaces/iuser';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/_services/game.service';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-host-lobby',
  templateUrl: './host-lobby.component.html',
  styleUrls: ['./host-lobby.component.scss'],
})
export class HostLobbyComponent implements OnInit {
  users: IUser[];
  hostname: IUser;
  subscription: any;
  constructor(
    private router: Router,
    private userService: UserService,
    private gameService: GameService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.hostname = JSON.parse(sessionStorage.getItem('userInfo'));
    this.subscription = setInterval(() => {
      this.getUsers();
    }, 1000);
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe((data) => {
        this.users = data.filter((user) => user.role === 'participant');
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  startGame(): void {
    if (!confirm('Start the game?')) {
      return;
    }

    const payload = {
      status: 1,
      endgame: 0,
    };

    this.gameService.updateGameStatus(payload)
      .subscribe(() => {
        clearInterval(this.subscription);
        this.router.navigate([ '/host-game' ], { relativeTo: this.route });
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

}
