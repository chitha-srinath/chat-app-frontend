// // src/app/services/socket.service.ts

// import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
// import { Observable } from 'rxjs';
// import { ChatEvents } from '../types/socket-events';

// @Injectable({
//   providedIn: 'root',
// })
// export class SocketService {
//   private socket: Socket;

//   constructor() {
//     this.socket = io(`${environment.socketUrl}`, {
//         transports: ['websocket'],
//         autoConnect: false,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//         reconnectionDelayMax: 5000,
//         timeout: 20000,
//         pingInterval: 25000,
//         pingTimeout: 60000,
//         upgrade: false,
//         forceNew: true,
//         multiplex: false,
//         withCredentials: true,

//     });

//     this.socket.on('connect', () => {
//       console.log('Connected to socket server:', this.socket.id);
//     });

//     this.socket.on('disconnect', () => {
//       console.log('Disconnected from socket server');
//     });
//   }



//   // Emit events
//   emit(event: ChatEvents, data: any) {
//     this.socket.emit(event, data);
//   }

//   // Listen to events
//   listen<T>(event: ChatEvents): Observable<T> {
//     return new Observable((subscriber) => {
//       this.socket.on(event, (data: T) => {
//         subscriber.next(data);
//       });
//     });
//   }

//   // Disconnect manually
//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//     }
//   }
// }
