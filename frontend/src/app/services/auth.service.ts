import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Task } from '../shared/interfaces/task.interface';
import { User, Role, LoginRequest, LoginResponse } from '../shared/interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserKey = 'currentUser';
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  // login username ve password gönderilir ve response olarak token ve user bilgileri döner
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

  // admin için tüm kullanıcıları getirir
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  // kullanıcı verilerini hazır format olarak döndürür
  getUserData(): { 
    isAuthenticated: boolean; 
    user: User | null; 
    username: string;
    isAdmin: boolean; 
    pageTitle: string; 
    showAdminBadge: boolean;
    shouldLoadUsers: boolean;
  } {
    const user = this.getCurrentUser();
    const isAuthenticated = user !== null;
    const isAdmin = this.isAdmin();
    
    return {
      isAuthenticated,
      user,
      username: user?.username || '',
      isAdmin,
      pageTitle: isAdmin ? 'Tüm Görevler' : 'Görevlerim',
      showAdminBadge: isAdmin,
      shouldLoadUsers: isAdmin
    };
  }

  canEditTask(task: Task, currentUser: User | null): boolean {
    if (!currentUser) return false;
    if (this.isAdmin()) return true;
    return task.user?.id === currentUser.id;
  }

  canDeleteTask(task: Task, currentUser: User | null): boolean {
    if (!currentUser || !task.id) return false;
    if (this.isAdmin()) return true;
    return task.user?.id === currentUser.id;
  }

  // görev düzenleme yetkisi kontrolü ve hata mesajı
  validateEditPermission(task: Task, currentUser: User | null): { 
    canEdit: boolean; 
    errorMessage: string;
  } {
    if (!currentUser) {
      return {
        canEdit: false,
        errorMessage: 'Kullanıcı bilgisi bulunamadı!'
      };
    }
    
    if (this.isAdmin()) {
      return { 
        canEdit: true,
        errorMessage: ''
      };
    }
    
    if (task.user?.id !== currentUser.id) {
      return {
        canEdit: false,
        errorMessage: 'Sadece kendi görevlerinizi düzenleyebilirsiniz!'
      };
    }
    
    return { 
      canEdit: true,
      errorMessage: ''
    };
  }

  // görev silme yetkisi kontrolü ve hata mesajı
  validateDeletePermission(task: Task, currentUser: User | null): { 
    canDelete: boolean; 
    errorMessage: string;
  } {
    if (!currentUser) {
      return {
        canDelete: false,
        errorMessage: 'Kullanıcı bilgisi bulunamadı!'
      };
    }
    
    if (!task.id) {
      return {
        canDelete: false,
        errorMessage: 'Görev ID bulunamadı!'
      };
    }
    
    if (this.isAdmin()) {
      return { 
        canDelete: true,
        errorMessage: ''
      };
    }
    
    if (task.user?.id !== currentUser.id) {
      return {
        canDelete: false,
        errorMessage: 'Sadece kendi görevlerinizi silebilirsiniz!'
      };
    }
    
    return { 
      canDelete: true,
      errorMessage: ''
    };
  }

  // authentication kontrolü
  ensureAuthenticated(): { 
    isAuthenticated: boolean; 
    shouldRedirect: boolean;
  } {
    const isAuthenticated = this.isLoggedIn();
    return {
      isAuthenticated,
      shouldRedirect: !isAuthenticated
    };
  }
}


