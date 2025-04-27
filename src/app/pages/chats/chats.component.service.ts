import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '../../utility/http-service';
import { devEnvironment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatsComponentService {
  // constructor(private http: BaseHttpService) { } // Inject the BaseHttpService for HTTP requests
  http = inject(BaseHttpService); // Use Angular's dependency injection to get an instance of BaseHttpService
  baseUrl = devEnvironment.apiUrl; // Use the base URL from the environment file

  // Define a method to fetch data from an API endpoint
  userChats(userId: string): Observable<any> {
    return this.http.get(this.baseUrl + `/users/chats/${userId}`); // Use the get method from BaseHttpService
  }
}
