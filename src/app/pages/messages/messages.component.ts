import { Component, computed, inject, signal } from '@angular/core';
import { BaseUserService } from '../../utility/user-data.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessagesComponentService } from './messages.component.service';
import { CommonModule } from '@angular/common';

export interface Reaction {
  userId: string;
  emoji: string;
}

export interface FilePreview {
  file: File;
  preview: string;
}

export interface Message {
  _id: string;
  senderId: string;
  message: string;
  timestamp: Date;
  isEdited: boolean;
  isDeleted: boolean;
  isReplied: boolean;
  replyToMessage?: string;
  files?: string[];
  reactions: Reaction[];
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  private userService = inject(BaseUserService);
  private fb = inject(FormBuilder);

  loggedInUser = this.userService.getUserData();

  chatMesssages = signal([
    {
      _id: '1',
      senderId: '1',
      message: 'Hello!',
      timestamp: new Date(),
    },
    {
      _id: '2',
      senderId: '2',
      message: 'Hi there!',
      timestamp: new Date(),
    },
    {
      _id: '3',
      senderId: '1',
      message: 'How are you?',
      timestamp: new Date(),
    },
  ]);

  // messageForm = this.fb.group({
  //   message: ['', Validators.required],
  // });

  private chatService = inject(MessagesComponentService);
  // private fb = inject(FormBuilder);

  messages = this.chatService.getMessages();
  currentUserId = computed(() => this.chatService.getCurrentUserId());

  messageForm: FormGroup;
  replyingTo = signal<Message | null>(null);
  editingMessage = signal<Message | null>(null);
  selectedFiles: File[] = [];
  activeMenu = signal<string | null>(null);

  constructor() {
    this.messageForm = this.fb.group({
      message: [''],
    });
  }

  toggleMenu(messageId: string) {
    this.activeMenu.set(this.activeMenu() === messageId ? null : messageId);
  }

  findReplyMessage(messageId: string) {
    return this.messages().find((m) => m._id === messageId);
  }

  async sendMessage() {
    if (
      !this.messageForm.value.message?.trim() &&
      this.selectedFiles.length === 0
    )
      return;

    const fileUrls = await this.uploadFiles();

    if (this.editingMessage()) {
      this.chatService.editMessage(
        this.editingMessage()!._id,
        this.messageForm.value.message || ''
      );
      this.editingMessage.set(null);
    } else {
      this.chatService.sendMessage(
        this.messageForm.value.message || '',
        this.replyingTo()?._id,
        fileUrls
      );
      this.replyingTo.set(null);
    }

    this.messageForm.reset();
    this.selectedFiles = [];
    this.activeMenu.set(null);
  }

  deleteMessage(messageId: string) {
    this.chatService.deleteMessage(messageId);
    this.activeMenu.set(null);
  }

  startEdit(message: Message) {
    this.editingMessage.set(message);
    this.messageForm.patchValue({ message: message.message });
    this.activeMenu.set(null);
  }

  replyToMessage(message: Message) {
    this.replyingTo.set(message);
    this.activeMenu.set(null);
  }

  cancelReply() {
    this.replyingTo.set(null);
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files)];
    }
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
  }

  async uploadFiles(): Promise<string[]> {
    return this.selectedFiles.map((file) => URL.createObjectURL(file));
  }

  isImage(url: string): boolean {
    return url.match(/\.(jpg|jpeg|png|gif)$/i) !== null;
  }

  getFileName(url: string): string {
    return url.split('/').pop() || 'file';
  }

  toggleReaction(messageId: string, emoji: string) {
    this.chatService.addReaction(messageId, emoji);
  }

  showReactionPicker(message: Message) {
    const emojis = ['👍', '❤️', '😄', '😮', '😢', '👏'];
    const emoji = prompt('Choose an emoji: ' + emojis.join(' '));
    if (emoji) {
      this.chatService.addReaction(message._id, emoji);
    }
    this.activeMenu.set(null);
  }

  hasUserReacted(reactions: Reaction[], emoji: string): boolean {
    return reactions.some(
      (r) =>
        r.userId === this.chatService.getCurrentUserId() && r.emoji === emoji
    );
  }

  groupReactions(reactions: Reaction[]): { emoji: string; count: number }[] {
    const groups = reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groups).map(([emoji, count]) => ({ emoji, count }));
  }
}
