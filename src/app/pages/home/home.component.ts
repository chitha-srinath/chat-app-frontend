import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeComponentService } from './home.component.service';
import { Router } from '@angular/router';
import { BaseUserService } from '../../utility/user-data.service';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // Define the form builder using Angular's dependency injection
  // This allows us to create reactive forms easily
  private readonly fb = inject(FormBuilder);
  private readonly homeComponentService = inject(HomeComponentService); // Inject the HomeComponentService for API calls
  private readonly router = inject(Router); // Inject the Router for navigation
  private readonly userService = inject(BaseUserService); // Inject the FormBuilder for creating forms

  readonly loginForm;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  emailControl() {
    return this.loginForm.get('email'); // Access the email control from the form
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form Submitted!', this.loginForm.value);
      this.homeComponentService
        .emailLogin(this.loginForm?.value?.email!)
        .subscribe({
          next: (response) => {
            this.router.navigate(['chats']);
            this.userService.setUserData(response); // Store user data in the service
          },
          error: (error) => {
            console.error('API Error:', error);
          },
        });
    }
  }
}
