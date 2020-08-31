import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../_services/user.service';

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
  ) { }

  ngOnInit(): void {
    this.username = new FormControl('', [Validators.required]);
  }

  goBack(): void {
    this.back.emit();
  }

  enterUsername(): void {
    this.isSubmitted = true;

    const { value } = this.username;

    if (value === ' ') {
      this.isSpaceOnly = true;
      return;
    }

    if (this.username.invalid) {
      return;
    }

    sessionStorage.setItem('username', value);

    if (!!this.selectedRole) {
      if (this.selectedRole === 'host') {
        this.userService.host.next(value);
        this.router.navigate([ '/host-lobby' ]);
        return;
      }

      this.userService.addNewParticipant(value);
      this.router.navigate([ '/participant-lobby' ]);
    }
  }

}
