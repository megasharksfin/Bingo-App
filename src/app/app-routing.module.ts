import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './_pages/home/home.component';
import { HostLobbyComponent } from './_pages/host-lobby/host-lobby.component';
import { ParticipantLobbyComponent } from './_pages/participant-lobby/participant-lobby.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: 'host-lobby', component: HostLobbyComponent },
  { path: 'participant-lobby', component: ParticipantLobbyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
