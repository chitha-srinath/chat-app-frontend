import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'chats',
    loadComponent: () =>
      import('./pages/chats/chats.component').then((m) => m.ChatsComponent),
  },
  {
    path: 'chats/:id',
    loadComponent: () =>
      import('./pages/messages/messages.component').then(
        (m) => m.MessagesComponent
      ),
  }
];
