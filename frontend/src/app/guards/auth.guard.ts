import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard - Route koruma guard'ı
 * - Kullanıcının authenticated olup olmadığını kontrol eder
 * - Eğer authenticated değilse login sayfasına yönlendirir
 * - Protected route'lar için kullanılır (örn: /tasks)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Kullanıcı authenticated değilse login sayfasına yönlendir
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
}
