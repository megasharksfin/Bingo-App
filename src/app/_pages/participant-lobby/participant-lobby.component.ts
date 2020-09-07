import { Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../../_services/game.service';
import { IBingoCard, IBingoNumber, IUser } from 'src/app/_interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-participant-lobby',
  templateUrl: './participant-lobby.component.html',
  styleUrls: ['./participant-lobby.component.scss']
})
export class ParticipantLobbyComponent implements OnInit {
  bingoCard: IBingoCard;
  isStarted: boolean;
  hasEnded: boolean;
  existingNumbers: IBingoNumber[];
  currentNumber: IBingoNumber;
  users: IUser[];
  gameApi: any;
  userApi: any;
  modalRef: NgbModalRef;
  modalInterval: any;
  playerBingo: IUser;
  currentUser: IUser = JSON.parse(sessionStorage.getItem('userInfo'));
  @ViewChild ('content', { static: false }) content: any;

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.gameApi = setInterval(() => {
      this.getGameStatus();
      this.getExistingNumbers();

      if (this.hasEnded) {
        alert('The host has ended the game. Click OK to return to the homepage.');
        this.router.navigate([ '/home' ], { relativeTo: this.route });
        clearInterval(this.gameApi);
      }
    }, 1000);

    this.userApi = setInterval(() => {
      this.getUsers();
    }, 500);

    const bingoC = this.getBingoNumbers(1, 15).slice(0, 5);
    const bingoL = this.getBingoNumbers(16, 30).slice(0, 5);
    const bingoO = this.getBingoNumbers(31, 45).slice(0, 4);
    const bingoR = this.getBingoNumbers(46, 60).slice(0, 5);
    const bingoX = this.getBingoNumbers(61, 75).slice(0, 5);

    const bingoNumberC: IBingoNumber[] = bingoC.map((num) => {
      return { letter: 'C', number: `${num}`, disabled: false };
    });
    const bingoNumberL: IBingoNumber[] = bingoL.map((num) => {
      return { letter: 'L', number: `${num}`, disabled: false };
    });
    const bingoNumberO: IBingoNumber[] = bingoO.map((num) => {
      return { letter: 'O', number: `${num}`, disabled: false };
    });
    const bingoNumberR: IBingoNumber[] = bingoR.map((num) => {
      return { letter: 'R', number: `${num}`, disabled: false };
    });
    const bingoNumberX: IBingoNumber[] = bingoX.map((num) => {
      return { letter: 'X', number: `${num}`, disabled: false };
    });

    this.bingoCard = {
      bingoC: bingoNumberC,
      bingoL: bingoNumberL,
      bingoO: bingoNumberO,
      bingoR: bingoNumberR,
      bingoX: bingoNumberX,
    };
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe((data) => {
        this.users = data;
        this.playerBingo = this.users.find((u) => u.isBingo > 0);
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  getExistingNumbers(): void {
    this.gameService.getBingoNumbers()
      .subscribe((data) => {
        this.existingNumbers = data;
        this.currentNumber = data[data.length - 1];
      }, ({ error }) => {
        const { message } = error;
        alert(message);
      });
  }

  getGameStatus(): void {
    this.gameService.getGameStatus()
      .subscribe((data) => {
        const { status, endgame } = data;
        if (status > 0) {
          this.isStarted = true;
          return;
        }

        if (endgame > 0) {
          this.hasEnded = true;
          return;
        }

        this.hasEnded = false;
        this.isStarted = false;
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  getBingoNumbers(min: number, max: number): number[] {
    const numberRange: number[] = this.getNumberRange(15, min);

    let j = 0;
    let temp: any;

    for (let i = numberRange.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));

      temp = numberRange[i];
      numberRange[i] = numberRange[j];
      numberRange[j] = temp;
    }

    return numberRange;
  }

  isBingoNumber(bingoNumber: IBingoNumber): void {
    if (!this.currentNumber) {
      alert(`No number has been shown yet. Please wait for the host's cue before clicking a number.`);
      return;
    }

    if (+bingoNumber.number !== +this.currentNumber?.number) {
      alert('Selected number does not match the number shown.');
      return;
    }

    let index: number;
    switch (bingoNumber.letter) {
      case 'C':
        index = this.bingoCard.bingoC.indexOf(bingoNumber);

        if (index > -1) {
          this.bingoCard.bingoC[index].disabled = true;
        }
        break;
      case 'L':
        index = this.bingoCard.bingoL.indexOf(bingoNumber);

        if (index > -1) {
          this.bingoCard.bingoL[index].disabled = true;
        }
        break;
      case 'O':
        index = this.bingoCard.bingoO.indexOf(bingoNumber);

        if (index > -1) {
          this.bingoCard.bingoO[index].disabled = true;
        }
        break;
      case 'R':
        index = this.bingoCard.bingoR.indexOf(bingoNumber);

        if (index > -1) {
          this.bingoCard.bingoR[index].disabled = true;
        }
        break;
      case 'X':
        index = this.bingoCard.bingoX.indexOf(bingoNumber);

        if (index > -1) {
          this.bingoCard.bingoX[index].disabled = true;
        }
        break;
    }
  }

  hasBingo(content: any): void {
    const user: IUser = JSON.parse(sessionStorage.getItem('userInfo'));
    this.userApi = setInterval(() => {
      this.getUsers();
    }, 500);

    this.userService.hasBingo(user.userId, 1)
      .subscribe(() => {
        this.modalRef = this.modalService.open(content, {
          size: 'lg',
          keyboard: false,
          backdrop: 'static',
          beforeDismiss: () => {
            return false;
          },
        });

        const index = this.users.indexOf(this.playerBingo);

        if (index > -1) {
          this.users[index].isBingo = 1;
        }

        clearInterval(this.gameApi);

        this.modalInterval = setInterval(() => {
          if (this.users?.every((u) => u.isBingo < 1)) {
            this.modalRef.close();
            clearInterval(this.userApi);
            clearInterval(this.modalInterval);

            this.gameApi = setInterval(() => {
              this.getGameStatus();
              this.getExistingNumbers();

              if (this.hasEnded) {
                alert('The host has ended the game. Click OK to return to the homepage.');
                this.router.navigate([ '/home' ], { relativeTo: this.route });
                clearInterval(this.gameApi);
              }
            }, 1000);
          }
        }, 500);
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  quitGame(): void {
    if (!confirm('Are you sure you want to quit the game? You cannot go back after quitting.')) {
      return;
    }

    this.userService.deleteUser(this.currentUser?.userId)
      .subscribe(() => {
        this.router.navigate([ '/home' ], { relativeTo: this.route });
        sessionStorage.removeItem('userInfo');
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  private getNumberRange(size: number, startAt: number): number[] {
    return [ ...Array(size).keys() ].map((i) => i + startAt);
  }
}
