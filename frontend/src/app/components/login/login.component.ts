import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../shared/interfaces/user.interface';
import { getErrorMessage } from '../../shared/utils/error.utils';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  private destroy$ = new Subject<void>(); 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
   
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
            const errorMessage = getErrorMessage(
              error as HttpErrorResponse,
              'Kullanıcı adı veya şifre hatalı!'
            );
            if (!environment.production) {
              console.error('Login hatası:', error);
            }
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

  // template helper ,field geçersiz mi kontrol et
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
