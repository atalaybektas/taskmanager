import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../shared/interfaces/task.interface';
import { User } from '../../shared/interfaces/user.interface';
import { TaskFormValue } from '../../shared/interfaces/task-form.interface';
import { TASK_STATUS_OPTIONS_FOR_DROPDOWN, TASK_FORM_LABELS } from '../../shared/constants/task.constants';
import { prepareFormConfig, prepareFormPatchValue, prepareTaskRequest } from '../../shared/utils/form.utils';
import { getErrorMessage } from '../../shared/utils/error.utils';
import { environment } from '../../../environments/environment';


 //görev oluşturma ve düzenleme formu

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() task: Task | null = null;
  @Input() isEditMode = false;
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  taskForm!: FormGroup;
  loading = false;
  currentUser: User | null = null;
  isAdmin = false;
  users: User[] = []; // admin için kullanıcı listesi
  loadingUsers = false;

  statusOptions = TASK_STATUS_OPTIONS_FOR_DROPDOWN;

  private destroy$ = new Subject<void>(); 

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    
    if (this.isAdmin) {
      this.loadUsers();
    }
    
    this.initForm();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.authService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
          this.loadingUsers = false;
        },
        error: (error: unknown) => {
          this.loadingUsers = false;
          if (!environment.production) {
            console.error('Kullanıcılar yüklenirken hata:', error);
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Kullanıcılar yüklenirken bir hata oluştu!'
          });
        }
      });
  }

  ngOnChanges(): void {
    if (this.taskForm) {
      // form varsa değerleri güncelle
      const hasTargetUserIdField = !!this.taskForm.get('targetUserId');
      const patchValue = prepareFormPatchValue(
        this.task,
        this.isAdmin,
        this.isEditMode,
        hasTargetUserIdField
      );
      
      this.taskForm.patchValue(patchValue);
    } else if (this.task) {
      this.initForm();
    }
  }

  initForm(): void {
    const formConfig = prepareFormConfig(
      this.task,
      this.isAdmin,
      this.isEditMode,
      this.currentUser
    );
    
    this.taskForm = this.fb.group(formConfig);
  }

  onSave(): void {
    if (!this.taskForm.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Lütfen tüm zorunlu alanları doldurun!'
      });
      return;
    }

    this.loading = true;
    const formValue: TaskFormValue = this.taskForm.value;
    
    const requestBody = prepareTaskRequest(formValue, this.isAdmin);

    // create veya update işlemi
    const taskObservable = this.isEditMode && this.task?.id
      ? this.taskService.updateTask(this.task.id, requestBody)
      : this.taskService.createTask(requestBody);

    taskObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Task) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: this.labels.successMessage
          });
          this.saved.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          const errorMessage = getErrorMessage(error, this.labels.errorMessage);
          if (!environment.production) {
            console.error('Görev kaydetme hatası:', error);
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
  }

  // template helper  field geçersiz mi kontrol et
  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  // label'ları dinamik olarak getir
  get labels() {
    return this.isEditMode ? TASK_FORM_LABELS.EDIT : TASK_FORM_LABELS.CREATE;
  }

  // template helper kullanıcı rolüne göre css class
  getUserRoleClass(user: User): string {
    return user.role ? `role-${user.role.toLowerCase()}` : '';
  }

  onCancel(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}