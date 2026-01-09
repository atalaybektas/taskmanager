import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { LoggerService } from '../../core/services/logger.service';
import { Task } from '../../shared/interfaces/task.interface';
import { User } from '../../shared/interfaces/user.interface';
import { TaskFormValue } from '../../shared/interfaces/task-form.interface';
import { TASK_STATUS_OPTIONS_FOR_DROPDOWN } from '../../shared/constants/task.constants';
import { UI_CONSTANTS } from '../../core/constants/ui.constants';


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
  showUserSelector = false; // admin için kullanıcı seçici göster
  dialogTitle = ''; 
  saveButtonLabel = ''; 
  successMessage = ''; 
  errorMessage = ''; 
  users: User[] = []; // admin için kullanıcı listesi
  loadingUsers = false;

  statusOptions = TASK_STATUS_OPTIONS_FOR_DROPDOWN;

  private destroy$ = new Subject<void>(); 

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private logger: LoggerService,
    private messageService: MessageService
  ) {}

  
  ngOnInit(): void {
    const userData = this.authService.getUserData();
    this.currentUser = userData.user;
    this.isAdmin = userData.isAdmin;
    this.showUserSelector = userData.shouldLoadUsers;
    
    // edit/create moduna göre label'ları al
    const labels = this.taskService.getFormLabels(this.isEditMode);
    this.dialogTitle = labels.dialogTitle;
    this.saveButtonLabel = labels.saveButtonLabel;
    this.successMessage = labels.successMessage;
    this.errorMessage = labels.errorMessage;
    
    if (userData.shouldLoadUsers) {
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
          this.logger.error('Kullanıcılar yüklenirken hata:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Kullanıcılar yüklenirken bir hata oluştu!'
          });
        }
      });
  }

  ngOnChanges(): void {
    // input değiştiğinde label'ları güncelle
    const labels = this.taskService.getFormLabels(this.isEditMode);
    this.dialogTitle = labels.dialogTitle;
    this.saveButtonLabel = labels.saveButtonLabel;
    this.successMessage = labels.successMessage;
    this.errorMessage = labels.errorMessage;
    
    if (this.taskForm) {
      // form varsa değerleri güncelle
      const hasTargetUserIdField = !!this.taskForm.get('targetUserId');
      const patchValue = this.taskService.prepareFormPatchValue(
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
    const formConfig = this.taskService.prepareFormConfig(
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
    
    const requestBody = this.taskService.prepareTaskRequest(
      formValue,
      this.isAdmin
    );

    // create veya update işlemi
    this.taskService.saveTask(this.task?.id, requestBody, this.isEditMode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Task) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: this.successMessage
          });
          this.saved.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          const errorMessage = this.errorHandler.handleError(error, this.errorMessage);
          this.logger.error('Görev kaydetme hatası:', error);
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

  // template helper kullanıcı rolüne göre css class
  getUserRoleClass(user: User): string {
    return this.taskService.getUserRoleClass(user);
  }

  onCancel(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}