import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { GameService } from 'src/app/_services/game.service';
import { IUser } from 'src/app/_interfaces';

@Component({
  selector: 'app-enter-username',
  templateUrl: './enter-username.component.html',
  styleUrls: ['./enter-username.component.scss'],
})
export class EnterUsernameComponent implements OnInit {
  @Input() usernameMessage: string;
  @Input() selectedRole: string;
  @Output() back = new EventEmitter<void>();
  isSpaceOnly = false;
  username: FormControl;
  isSubmitted = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private gameService: GameService,
  ) { }

  ngOnInit(): void {
    this.username = new FormControl('', [Validators.required]);
    this.updateGameStatus();
  }

  updateGameStatus(): void {
    const payload = {
      status: 0,
      endgame: 0,
    };

    this.gameService.updateGameStatus(payload)
      .subscribe(() => {
      }, ({ error }) => {
        const { message } = error;
        alert(message);
      });
  }

  goBack(): void {
    this.back.emit();
  }

  enterUsername(): void {
    this.isSubmitted = true;

    const { value } = this.username as { value: string };

    if (value === ' ') {
      this.isSpaceOnly = true;
      return;
    }

    if (this.username.invalid) {
      return;
    }

    if (!!this.selectedRole) {
      if (this.selectedRole === 'host') {
        this.userService.addUser(value, 'host')
          .subscribe((data) => {
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            this.router.navigate([ '/host-lobby' ]);
          }, (error) => {
            const { message } = error;
            alert(message);
          });
      } else if (this.selectedRole === 'participant') {
        this.userService.addUser(value, 'participant')
          .subscribe((data) => {
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            this.router.navigate([ '/participant-game' ]);
          }, (error) => {
            const { message } = error;
            alert(message);
          });
      }
    }
  }

}
