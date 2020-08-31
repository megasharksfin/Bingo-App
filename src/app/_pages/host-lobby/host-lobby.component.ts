import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-host-lobby',
  templateUrl: './host-lobby.component.html',
  styleUrls: ['./host-lobby.component.scss'],
})
export class HostLobbyComponent implements OnInit {
  users: string[];
  hostname: string;
  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.hostname = sessionStorage.getItem('username');
    this.userService.participantList
      .subscribe((data) => this.users = data);
  }

}
