import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * LoginGuard - Login sayfası için reverse guard
 * - Eğer kullanıcı zaten authenticated ise login sayfasına erişimi engeller
 * - Authenticated kullanıcıları tasks sayfasına yönlendirir
 */
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Kullanıcı zaten giriş yapmışsa tasks sayfasına yönlendir
      this.router.navigate(['/tasks']);
      return false;
    }

    // Kullanıcı authenticated değilse login sayfasına erişim izni ver
    return true;
  }
}
