import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../shared/interfaces/user.interface';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { LoggerService } from '../../core/services/logger.service';

/**
 * login component - kullanıcı girişi yapar
 * - reactive forms ile form validation
 * - jwt token alır ve localStorage'a kaydeder
 * - başarılı olursa router ile /tasks sayfasına yönlendirir
 * - rxjs takeUntil ile memory leak önler
 * - primeng toast ile mesaj gösterir
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  private destroy$ = new Subject<void>(); // component destroy için

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private logger: LoggerService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // LoginGuard route seviyesinde kontrol yapıyor, burada sadece form'u oluşturuyoruz
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: LoginResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Başarılı',
              detail: `Hoş geldiniz, ${response.username}!`
            });
            // login başarılı, tasks sayfasına yönlendir
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            this.loading = false;
            const errorMessage = this.errorHandler.handleError(
              error,
              'Kullanıcı adı veya şifre hatalı!'
            );
            this.logger.error('Login hatası:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Hata',
              detail: errorMessage
            });
          },
          complete: () => {
            this.loading = false;
          }
        });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Lütfen tüm alanları doldurun!'
      });
    }
  }

  // template helper - field geçersiz mi kontrol et
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
