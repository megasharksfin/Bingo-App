import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterUsernameComponent } from './enter-username.component';

describe('EnterUsernameComponent', () => {
  let component: EnterUsernameComponent;
  let fixture: ComponentFixture<EnterUsernameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterUsernameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
