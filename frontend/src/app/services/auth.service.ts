import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, Role, LoginRequest, LoginResponse } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserKey = 'currentUser';
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { username, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          const user: User = {
            id: response.id,
            username: response.username,
            role: response.role
          };
          localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        })
      );
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.currentUserKey);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.tokenKey);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === Role.ADMIN;
  }

  getUserRole(): Role | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }
}


