import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { LoggerService } from '../../core/services/logger.service';
import { Task, Page, TaskWithStatus } from '../../shared/interfaces/task.interface';
import { User } from '../../shared/interfaces/user.interface';
import { PaginatorEvent } from '../../shared/interfaces/paginator-event.interface';
import { PAGINATION_CONSTANTS } from '../../core/constants/pagination.constants';
import { UI_CONSTANTS } from '../../core/constants/ui.constants';
import { TASK_STATUS_OPTIONS } from '../../shared/constants/task.constants';

// login sonrası görev listesi sayfası
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  pageTitle = '';
  username = '';
  showAdminBadge = false;
  totalPages = 0;
  tasksWithStatus: TaskWithStatus[] = [];
  
  tasks: Task[] = [];
  page: Page<Task> | null = null;
  currentUser: User | null = null;
  selectedStatus: string | null = null;
  loading = false;
  isAdmin = false;
  
  currentPage = 0;
  readonly pageSize = PAGINATION_CONSTANTS.PAGE_SIZE;
  totalElements = 0;

  statusOptions = TASK_STATUS_OPTIONS;

  private destroy$ = new Subject<void>(); 

  displayDialog = false;
  selectedTask: Task | null = null;
  isEditMode = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private logger: LoggerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // AuthGuard route seviyesinde kontrol yapıyor, burada sadece kullanıcı bilgilerini yüklüyoruz
    const userData = this.authService.getUserData();
    this.currentUser = userData.user;
    this.isAdmin = userData.isAdmin;
    this.pageTitle = userData.pageTitle;
    this.username = userData.username;
    this.showAdminBadge = userData.showAdminBadge;

    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks(
      this.selectedStatus || undefined,
      this.currentPage,
      PAGINATION_CONSTANTS.DEFAULT_SORT
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (page: Page<Task>) => {
        this.page = page;
        this.tasks = page.content;
        this.totalElements = page.totalElements;
        this.currentPage = page.number;
        this.totalPages = page.totalPages;
        
        // status bilgilerini zenginleştir
        this.tasksWithStatus = this.taskService.enrichTasksWithStatus(page.content);
        
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        const errorMessage = this.errorHandler.handleError(
          error as HttpErrorResponse,
          'Görevler yüklenirken bir hata oluştu!'
        );
        this.logger.error('Görev yükleme hatası:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: errorMessage
        });
      }
    });
  }
  
  onPageChange(event: PaginatorEvent): void {
    this.currentPage = event.page ?? 0;
    this.loadTasks();
  }

  onStatusFilterChange(): void {
    // status değiştiğinde ilk sayfaya dön
    this.currentPage = 0;
    this.loadTasks();
  }

  openNewTaskDialog(): void {
    this.selectedTask = this.taskService.createNewTask();
    this.isEditMode = false;
    this.displayDialog = true;
  }

  openEditTaskDialog(task: Task): void {
    // yetki kontrolü
    const validation = this.authService.validateEditPermission(task, this.currentUser);
    if (!validation.canEdit) {
      this.messageService.add({
        severity: 'error',
        summary: 'Yetki Hatası',
        detail: validation.errorMessage
      });
      return;
    }
    
    // dropdown'ların kapanması için gecikme
    this.displayDialog = false;
    setTimeout(() => {
      this.selectedTask = { ...task };
      this.isEditMode = true;
      this.displayDialog = true;
    }, UI_CONSTANTS.DIALOG_OPEN_DELAY_MS);
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.selectedTask = null;
  }

  onTaskSaved(): void {
    this.loadTasks();
    this.closeDialog();
  }

  deleteTask(task: Task): void {
    // yetki kontrolü
    const validation = this.authService.validateDeletePermission(task, this.currentUser);
    if (!validation.canDelete) {
      this.messageService.add({
        severity: 'error',
        summary: 'Yetki Hatası',
        detail: validation.errorMessage
      });
      return;
    }

    // silme onayı dialog'u
    this.confirmationService.confirm({
      message: 'Bu görevi silmek istediğinize emin misiniz?',
      header: 'Silme Onayı',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Evet',
      rejectLabel: 'Hayır',
      accept: () => {
        const deleteResult = this.taskService.deleteTaskWithValidation(task);
        if (!deleteResult.observable) {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: deleteResult.errorMessage || 'Görev silinemedi!'
          });
          return;
        }

        deleteResult.observable
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Görev silindi!'
              });
              this.loadTasks();
            },
            error: (error: unknown) => {
              const errorMessage = this.errorHandler.handleError(
                error as HttpErrorResponse,
                'Görev silinirken bir hata oluştu!'
              );
              this.logger.error('Görev silme hatası:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Hata',
                detail: errorMessage
              });
            }
          });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
