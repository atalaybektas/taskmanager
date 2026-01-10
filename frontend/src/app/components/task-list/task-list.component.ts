import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task, Page, TaskWithStatus } from '../../shared/interfaces/task.interface';
import { User, Role } from '../../shared/interfaces/user.interface';
import { PaginatorEvent } from '../../shared/interfaces/paginator-event.interface';
import { PAGINATION_CONSTANTS } from '../../core/constants/pagination.constants';
import { UI_CONSTANTS } from '../../core/constants/ui.constants';
import { TASK_STATUS_OPTIONS } from '../../shared/constants/task.constants';
import { getErrorMessage } from '../../shared/utils/error.utils';
import { environment } from '../../../environments/environment';

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
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.username = this.currentUser?.username || '';
    this.pageTitle = this.isAdmin ? 'Tüm Görevler' : 'Görevlerim';
    this.showAdminBadge = this.isAdmin;

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
        this.tasksWithStatus = this.enrichTasksWithStatus(page.content);
        
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        const errorMessage = getErrorMessage(error as HttpErrorResponse, 'Görevler yüklenirken bir hata oluştu!');
        if (!environment.production) {
          console.error('Görev yükleme hatası:', error);
        }
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
    this.selectedTask = {
      title: '',
      description: '',
      status: 'NEW'
    };
    this.isEditMode = false;
    this.displayDialog = true;
  }

  openEditTaskDialog(task: Task): void {
    // yetki kontrolü
    if (!this.canEditTask(task)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Yetki Hatası',
        detail: 'Sadece kendi görevlerinizi düzenleyebilirsiniz!'
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
    if (!this.canDeleteTask(task)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Yetki Hatası',
        detail: 'Sadece kendi görevlerinizi silebilirsiniz!'
      });
      return;
    }

    if (!task.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata',
        detail: 'Görev ID bulunamadı!'
      });
      return;
    }

    // silme onayı dialogu
    this.confirmationService.confirm({
      message: 'Bu görevi silmek istediğinize emin misiniz?',
      header: 'Silme Onayı',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Evet',
      rejectLabel: 'Hayır',
      accept: () => {
        this.taskService.deleteTask(task.id!)
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
              const errorMessage = getErrorMessage(
                error as HttpErrorResponse,
                'Görev silinirken bir hata oluştu!'
              );
              if (!environment.production) {
                console.error('Görev silme hatası:', error);
              }
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

  private canEditTask(task: Task): boolean {
    if (!this.currentUser) return false;
    if (this.isAdmin) return true;
    return task.user?.id === this.currentUser.id;
  }

  private canDeleteTask(task: Task): boolean {
    if (!this.currentUser || !task.id) return false;
    if (this.isAdmin) return true;
    return task.user?.id === this.currentUser.id;
  }

  private enrichTasksWithStatus(tasks: Task[]): TaskWithStatus[] {
    return tasks.map(task => ({
      ...task,
      statusLabel: this.getStatusLabel(task.status),
      statusSeverity: this.getStatusSeverity(task.status),
      ownerName: task.user?.username || '-',
      description: task.description || '-'
    }));
  }

  private getStatusLabel(status: string): string {
    const option = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  private getStatusSeverity(status: string): string {
    switch (status) {
      case 'NEW':
        return 'info';
      case 'IN_PROGRESS':
        return 'warn';
      case 'DONE':
        return 'success';
      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
