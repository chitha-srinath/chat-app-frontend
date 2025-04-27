import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseUserService, UserData } from '../../utility/user-data.service';
import { Router } from '@angular/router';
import { ChatsComponentService } from './chats.component.service';
import { FormsModule } from '@angular/forms';

export interface Chats {
  _id: string;
  participants: UserData[];
  isGroup: boolean;
  lastMessageInfo: {
    message: string;
    timestamp: Date;
    senderId: string;
  };
  groupName?: string;
}

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit {
  private userService = inject(BaseUserService);
  private router = inject(Router);
  private chatsService = inject(ChatsComponentService);

  loggedInUser = this.userService.getUserData();

  userChats = signal<Chats[]>([
    {
      _id: '1',
      participants: [
        { _id: '1', name: 'John Doe', email: '', isOnline: false },
        this.loggedInUser!,
      ],
      isGroup: false,
      lastMessageInfo: {
        message: 'Hello!',
        timestamp: new Date(),
        senderId: '1',
      },
      groupName: '',
    },
  ]);
  chatMap = new Map<string, Chats>(); // Explicitly type the Map

  ngOnInit(): void {
    if (!this.loggedInUser) {
      console.error('User not logged in');
      this.router.navigate(['']);
      return;
    }

    this.chatsService.userChats(this.loggedInUser._id).subscribe({
      next: (response: Chats[]) => {
        this.userChats.set([...this.userChats(), ...response]);
        response.forEach((chat) => {
          this.chatMap.set(chat._id, chat);
        });
      },
      error: (error) => {
        console.error('API Error:', error);
      },
    });
  }

  selectChat(chat: Chats): void {
    console.log('Selected chat:', chat);
    this.router.navigate(['chats', chat._id]); // Fixed: Use _id instead of id
  }

  getChatUser(chat: Chats): UserData | undefined {
    if (chat.isGroup) return undefined;

    return chat.participants.find(
      (participant) => participant._id !== this.loggedInUser?._id
    );
  }

  getLastMsgUser(chat: Chats, senderId: string): string {
    if (chat.isGroup) return 'Group Message'; // Default for group chats

    const sender = chat.participants.find((p) => p._id === senderId);
    if (!sender) return 'Unknown';

    return sender._id === this.loggedInUser?._id ? 'You' : sender.name;
  }
}
