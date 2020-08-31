import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss'],
})
export class RoleSelectionComponent implements OnInit {
  @Output() roleSelection = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  getUserRole(role: string): void {
    this.roleSelection.emit(role);
  }

}
