// shared/services/http.service.ts
import { computed, Injectable, signal } from '@angular/core';

export interface UserData {
  _id: string; // User ID
  name: string;
  email: string;
  isOnline: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BaseUserService {
  private readonly userData = signal<UserData | null>(null);
  constructor() {
    const userData = localStorage.getItem('user-info'); // Retrieve user data from local storage
    if (userData) {
      this.setUserData(JSON.parse(userData)); // Parse and set the user data if it exists
    }
  }

  setUserData(data: any) {
    localStorage.setItem('user-info', JSON.stringify(data)); // Store user data in local storage
    this.userData.set(data); // Set the user data using the signal
  }
  getUserData = computed(() => this.userData()); // Create a computed property to access the user data
}
