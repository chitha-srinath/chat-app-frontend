import { inject, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../utility/http-service';
import { devEnvironment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Message, Reaction } from './messages.component';

@Injectable({ providedIn: 'root' })
export class MessagesComponentService {
  // constructor(private http: BaseHttpService) { } // Inject the BaseHttpService for HTTP requests
  http = inject(BaseHttpService); // Use Angular's dependency injection to get an instance of BaseHttpService
  baseUrl = devEnvironment.apiUrl; // Use the base URL from the environment file

  // Define a method to fetch data from an API endpoint
  chatMessages(chatId: string): Observable<any> {
    return this.http.get(this.baseUrl + `/messages/${chatId}`); // Use the get method from BaseHttpService
  }

  private messages = signal<Message[]>([]);
  private currentUserId = '1'; // Simulated logged-in user

  constructor() {
    // Initialize with some sample messages
    this.messages.set([
      {
        _id: '1',
        senderId: '1',
        message: 'Hello!',
        timestamp: new Date(),
        isEdited: false,
        isDeleted: false,
        isReplied: false,
        reactions: [],
      },
      {
        _id: '2',
        senderId: '2',
        message: 'Hi there!',
        timestamp: new Date(),
        isEdited: false,
        isDeleted: false,
        isReplied: false,
        reactions: [],
      },
    ]);
  }

  getMessages() {
    return this.messages;
  }

  getCurrentUserId() {
    return this.currentUserId;
  }

  sendMessage(content: string, replyToId?: string, files?: string[]) {
    const newMessage: Message = {
      _id: Date.now().toString(),
      senderId: this.currentUserId,
      message: content,
      timestamp: new Date(),
      isEdited: false,
      isDeleted: false,
      isReplied: !!replyToId,
      replyToMessage: replyToId,
      files,
      reactions: [],
    };

    this.messages.update((msgs: Message[]) => [newMessage, ...msgs]);
  }

  editMessage(messageId: string, newContent: string) {
    this.messages.update((msgs: Message[]) =>
      msgs.map((msg: Message) =>
        msg._id === messageId
          ? { ...msg, message: newContent, isEdited: true }
          : msg
      )
    );
  }

  deleteMessage(messageId: string) {
    this.messages.update((msgs: Message[]) =>
      msgs.map((msg: Message) =>
        msg._id === messageId
          ? { ...msg, isDeleted: true, message: 'This message was deleted' }
          : msg
      )
    );
  }

  addReaction(messageId: string, emoji: string) {
    const reaction: Reaction = {
      userId: this.currentUserId,
      emoji,
    };

    this.messages.update((msgs: Message[]) =>
      msgs.map((msg: Message) =>
        msg._id === messageId
          ? {
              ...msg,
              reactions: msg.reactions.some(
                (r: Reaction) =>
                  r.userId === this.currentUserId && r.emoji === emoji
              )
                ? msg.reactions.filter(
                    (r: Reaction) =>
                      !(r.userId === this.currentUserId && r.emoji === emoji)
                  )
                : [...msg.reactions, reaction],
            }
          : msg
      )
    );
  }
}
