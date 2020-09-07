import { Component, OnInit, ViewChild } from '@angular/core';
import { IBingoNumber, IUser } from 'src/app/_interfaces';
import { GameService } from 'src/app/_services/game.service';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-host-game',
  templateUrl: './host-game.component.html',
  styleUrls: ['./host-game.component.scss'],
})
export class HostGameComponent implements OnInit {
  generatedNumber: IBingoNumber;
  existingNumbers: IBingoNumber[];
  numberRange: IBingoNumber[];
  playerBingo: IUser;
  apiCall: any;
  modalRef: NgbModalRef;
  @ViewChild('content', {static: false}) content: any;
  constructor(
    private gameService: GameService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.apiCall = setInterval(() => {
      this.getUsers();

      if (!!this.playerBingo) {
        this.modalRef = this.modalService.open(this.content, {
          size: 'lg',
          keyboard: false,
          centered: true,
          backdrop: 'static',
          beforeDismiss: () => {
            return false;
          },
        });
        clearInterval(this.apiCall);
      }
    }, 500);

    const numbers = this.getNumberRange(75, 1);
    this.numberRange = numbers.map((num) => {
      let bingoNumber: IBingoNumber;
      if (num < 16) {
        bingoNumber = { letter: 'C', number: `${num}` };
        return bingoNumber;
      }

      if (num < 31) {
        bingoNumber = { letter: 'L', number: `${num}` };
        return bingoNumber;
      }

      if (num < 46) {
        bingoNumber = { letter: 'O', number: `${num}` };
        return bingoNumber;
      }

      if (num < 61) {
        bingoNumber = { letter: 'R', number: `${num}` };
        return bingoNumber;
      }

      if (num <= 75) {
        bingoNumber = { letter: 'X', number: `${num}` };
        return bingoNumber;
      }
    });
    this.getExisitngNumbers();
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe((data) => {
        this.playerBingo = data.find((user) => user.isBingo > 0);
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  getExisitngNumbers(): void {
    this.gameService.getBingoNumbers()
      .subscribe((data) => {
        this.existingNumbers = data || [];

        this.numberRange = this.numberRange.filter((num) => this.existingNumbers.indexOf(num) === -1);
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  generateBingoNumber(): void {
    const randomNumber = this.getRandomNumber();
    const letter = this.getBingoLetter(randomNumber);

    const payload: IBingoNumber = {
      letter,
      number: `${randomNumber}`,
    };

    this.gameService.addBingoNumber(payload)
      .subscribe((data) => {
        const numIndex = this.numberRange.findIndex((num) => num.number === data.number);

        if (numIndex > -1) {
          this.numberRange.splice(numIndex, 1);
        }

        this.generatedNumber = data;
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  endGame(): void {
    if (!confirm('Are you sure you want to end the game? All progress will be lost.')) {
      return;
    }

    const payload = {
      status: 0,
      endgame: 1,
    };

    this.modalRef?.close();
    this.router.navigate([ '/home' ], { relativeTo: this.route });

    const deleteUsers = this.userService.deleteAllUsers();
    const deleteBingoNumbers = this.gameService.deleteBingoNumbers();
    const setToFalse = this.gameService.updateGameStatus(payload);
    // tslint:disable-next-line: deprecation
    forkJoin(
      deleteUsers,
      deleteBingoNumbers,
      setToFalse
    ).subscribe(() => {
    }, (error) => {
      const { message } = error;
      alert(message);
    });
  }

  notBingo(modal: any): void {
    this.userService.hasBingo(this.playerBingo?.userId, 0)
      .subscribe(() => {
        modal.close();
        this.apiCall = setInterval(() => {
          this.getUsers();

          if (!!this.playerBingo) {
            this.modalService.open(this.content, {
              size: 'lg',
              keyboard: false,
              centered: true,
              backdrop: 'static',
              beforeDismiss: () => {
                return false;
              },
            });
            clearInterval(this.apiCall);
          }
        }, 500);
        this.playerBingo = null;
      }, (error) => {
        const { message } = error;
        alert(message);
      });
  }

  private getRandomNumber(): number {
    const randomNum  = +this.numberRange[Math.floor(Math.random() * this.numberRange.length)].number;

    const numIndex = this.numberRange.findIndex((num) => +num.number === randomNum);

    if (numIndex > -1) {
      this.numberRange.splice(numIndex, 1);
    }

    return randomNum;
  }

  private getNumberRange(size: number, startAt: number): number[] {
    return [ ...Array(75).keys() ].map((i) => i + 1);
  }

  private getBingoLetter(num: number): string {
    if (num < 16) {
      return 'C';
    }

    if (num < 31) {
      return 'L';
    }

    if (num < 46) {
      return 'O';
    }

    if (num < 61) {
      return 'R';
    }

    if (num <= 75) {
      return 'X';
    }
  }

}
