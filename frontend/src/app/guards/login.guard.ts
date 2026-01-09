import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


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
      // kullanıcı zaten giriş yapmışsa tasks sayfasına gecebilir
      this.router.navigate(['/tasks']);
      return false;
    }

    // kullanıcı authenticated değilse login sayfasına erişim izni ver
    return true;
  }
}
