import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './_pages/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoleSelectionComponent } from './_components/role-selection/role-selection.component';
import { EnterUsernameComponent } from './_component/enter-username/enter-username.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HostLobbyComponent } from './_pages/host-lobby/host-lobby.component';
import { ParticipantLobbyComponent } from './_pages/participant-lobby/participant-lobby.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RoleSelectionComponent,
    EnterUsernameComponent,
    HostLobbyComponent,
    ParticipantLobbyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
