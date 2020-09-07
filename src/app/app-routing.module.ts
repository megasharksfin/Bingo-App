import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './_pages/home/home.component';
import { HostLobbyComponent } from './_pages/host-lobby/host-lobby.component';
import { ParticipantLobbyComponent } from './_pages/participant-lobby/participant-lobby.component';
import { HostGameComponent } from './_pages/host-game/host-game.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: 'host-lobby', component: HostLobbyComponent },
  { path: 'participant-game', component: ParticipantLobbyComponent },
  { path: 'host-game', component: HostGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
