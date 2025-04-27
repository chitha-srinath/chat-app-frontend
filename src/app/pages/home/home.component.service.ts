import { Observable } from 'rxjs';
import { BaseHttpService } from '../../utility/http-service';
import { inject } from '@angular/core';
import { devEnvironment } from '../../../environments/environment.development';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeComponentService {
  // constructor(private http: BaseHttpService) { } // Inject the BaseHttpService for HTTP requests
  http = inject(BaseHttpService); // Use Angular's dependency injection to get an instance of BaseHttpService
  baseUrl = devEnvironment.apiUrl; // Use the base URL from the environment file

  // Define a method to fetch data from an API endpoint
  emailLogin(email: string): Observable<any> {
    return this.http.post(this.baseUrl + `/users`, {
      name: email.split('@')[0],
      email,
      isOnline: true,
    }); // Use the get method from BaseHttpService
  }
}
